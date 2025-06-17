import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl) {
  console.warn('VITE_SUPABASE_URL is not set in environment variables');
}

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY is not set in environment variables');
}

// Initialize Supabase client with error handling
let supabaseClient;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase client not initialized due to missing configuration');
    supabaseClient = {
      storage: {
        from: () => ({
          upload: async () => {
            throw new Error('Supabase not configured');
          },
          update: async () => {
            throw new Error('Supabase not configured');
          },
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    };
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabaseClient = {
    storage: {
      from: () => ({
        upload: async () => {
          throw new Error('Failed to initialize Supabase');
        },
        update: async () => {
          throw new Error('Failed to initialize Supabase');
        },
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
}

export const supabase = supabaseClient;

/**
 * Upload a file to Supabase Storage with versioning and cleanup
 * @param {string} bucket - The name of the Supabase storage bucket
 * @param {string} filePath - The path where the file will be stored
 * @param {Blob} file - The file to upload
 * @returns {Promise<{publicUrl: string|null, error: Error|null}>} - The public URL and any error
 */
export async function uploadFile(bucket, filePath, file) {
  try {
    if (!supabase?.storage) {
      throw new Error('Supabase storage is not properly configured');
    }
    
    // Parse the filePath to separate path and filename for versioning
    const lastSlashIndex = filePath.lastIndexOf('/');
    const path = lastSlashIndex !== -1 ? filePath.substring(0, lastSlashIndex + 1) : '';
    const filename = lastSlashIndex !== -1 ? filePath.substring(lastSlashIndex + 1) : filePath;
    
    // Split filename into base name and extension
    const dotIndex = filename.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
    const extension = dotIndex !== -1 ? filename.substring(dotIndex) : '';
    
    // Add timestamp to create a versioned filename
    const timestamp = Date.now();
    const versionedFilename = `${baseName}_${timestamp}${extension}`;
    const versionedFilePath = `${path}${versionedFilename}`;
    
    console.log(`Uploading file to ${bucket}/${versionedFilePath} (${file.size} bytes)`);
    
    // Upload the new versioned file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(versionedFilePath, file, {
        cacheControl: '0', // No cache to ensure fresh content
        contentType: 'application/pdf',
        duplex: 'half' // Required for large files in some environments
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return { publicUrl: null, error: uploadError };
    }
    
    // Get the public URL of the new file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(versionedFilePath);
    
    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
    }
    
    // List files with the same base name to clean up old versions
    try {
      // List files in the same directory
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(path.slice(0, -1)); // Remove trailing slash for list operation
      
      if (listError) {
        console.warn('Error listing files for cleanup:', listError);
        // Continue execution even if listing fails
      } else if (files && Array.isArray(files)) {
        // Find old versions of the same file (matching the base name but not the current version)
        const oldVersions = files.filter(file => {
          return file.name.startsWith(baseName) && 
                 file.name.endsWith(extension) && 
                 file.name !== versionedFilename;
        });
        
        // Delete old versions
        if (oldVersions.length > 0) {
          console.log(`Found ${oldVersions.length} old version(s) to clean up`);
          const filesToDelete = oldVersions.map(file => `${path}${file.name}`);
          
          const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove(filesToDelete);
          
          if (deleteError) {
            console.warn('Error cleaning up old versions:', deleteError);
            // Continue execution even if deletion fails
          } else {
            console.log(`Successfully cleaned up ${filesToDelete.length} old version(s)`);
          }
        }
      }
    } catch (cleanupError) {
      console.warn('Error during cleanup of old versions:', cleanupError);
      // Continue execution even if cleanup fails
    }
    
    console.log('File uploaded successfully. Public URL:', publicUrl);
    return { publicUrl, error: null };
    
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return { 
      publicUrl: null, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

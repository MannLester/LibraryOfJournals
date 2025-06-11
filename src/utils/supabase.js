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
 * Upload a file to Supabase Storage
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
    
    console.log(`Uploading file to ${bucket}/${filePath} (${file.size} bytes)`);
    
    // First, try to upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
        duplex: 'half' // Required for large files in some environments
      });
    
    if (uploadError) {
      // If the error is about the file already existing, try updating it
      if (uploadError.message.includes('already exists')) {
        console.log('File exists, updating...');
        const { error: updateError } = await supabase.storage
          .from(bucket)
          .update(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'application/pdf'
          });
        
        if (updateError) {
          console.error('Error updating file:', updateError);
          return { publicUrl: null, error: updateError };
        }
      } else {
        console.error('Error uploading file:', uploadError);
        return { publicUrl: null, error: uploadError };
      }
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
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

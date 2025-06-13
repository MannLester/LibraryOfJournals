<template>
  <div class="donate-page">
    <div class="header">
      <h1>Support Our Project</h1>
      <p class="subtitle">Help us reach our goals and build something amazing. Every contribution brings us closer to success.</p>
    </div>

    <!-- Overall Progress -->
    <div class="progress-section">
      <div class="progress-info">
        <div class="amount">
          <span class="current">₱75,000</span>
          <span class="target">of ₱165,000</span>
        </div>
        <div class="percentage">45% Complete</div>
      </div>
      <div class="progress-bar">
        <div class="progress" style="width: 45%"></div>
      </div>
    </div>

    <!-- Milestone Cards -->
    <div class="milestones">
      <div class="milestone-card completed">
        <div class="circle">
          <span class="checkmark">✓</span>
        </div>
        <h3>Mobile Version</h3>
        <p>Develop a mobile app version</p>
        <div class="milestone-amount">₱25,000/25,000</div>
      </div>

      <div class="milestone-card">
        <div class="circle">
          <span class="percentage">86%</span>
        </div>
        <h3>Database</h3>
        <p>Set up a robust database system</p>
        <div class="milestone-amount">₱30,000/35,000</div>
      </div>

      <div class="milestone-card">
        <div class="circle">
          <span class="percentage">80%</span>
        </div>
        <h3>Own Domain</h3>
        <p>Purchase and set up our own domain</p>
        <div class="milestone-amount">₱12,000/15,000</div>
      </div>

      <div class="milestone-card">
        <div class="circle">
          <span class="percentage">16%</span>
        </div>
        <h3>Server Hosting</h3>
        <p>Secure dedicated server hosting for 1 year</p>
        <div class="milestone-amount">₱8,000/50,000</div>
      </div>

      <div class="milestone-card">
        <div class="circle">
          <span class="percentage">0%</span>
        </div>
        <h3>Marketing</h3>
        <p>Launch comprehensive marketing campaign</p>
        <div class="milestone-amount">₱0/40,000</div>
      </div>
    </div>

    <!-- GCash Section -->
    <div class="donate-section">
      <div class="gcash-section">
        <h2>Donate via GCash</h2>
        <div class="qr-code">
          <!-- Add QR code image here -->
        </div>
        <p class="qr-instruction">Scan this QR code with your GCash app to donate</p>
        
        <div class="how-to-donate">
          <h3>How to Donate</h3>
          <ol>
            <li>Open your GCash app</li>
            <li>Tap on "Scan QR" from the home screen</li>
            <li>Scan the QR code above</li>
            <li>Enter your donation amount</li>
            <li>Complete the transaction</li>
            <li>Message us with your name and which goal you're supporting</li>
          </ol>
        </div>
      </div>

      <!-- Recent Donors -->
      <div class="donors-section">
        <h2>Recent Donors</h2>
        <div class="donor">
          <div class="donor-info">
            <span class="donor-name">Maria Santos</span>
            <span class="donor-date">2025-06-10</span>
          </div>
          <span class="donation-amount">₱15,000</span>
        </div>
        <div class="donor">
          <div class="donor-info">
            <span class="donor-name">John Doe</span>
            <span class="donor-date">2025-06-09</span>
          </div>
          <span class="donation-amount">₱10,000</span>
        </div>
      </div>
    </div>

    <!-- Thank You Message -->
    <div class="thank-you-message">
      <h2>Thank You for Your Support!</h2>
      <p>Your generous donations help us achieve specific goals and make a real difference. 
         Every contribution, no matter the size, brings us closer to completing our project milestones.</p>
    </div>
  </div>
</template>

<script setup>
// Add any reactive state or methods here
</script>

<style scoped>
.donate-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.progress-section {
  margin-bottom: 60px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.amount .current {
  font-size: 2rem;
  font-weight: bold;
  color: #E9184C;
}

.amount .target {
  color: #666;
  margin-left: 8px;
}

.percentage {
  font-weight: 500;
}

.progress-bar {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #E9184C;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.milestones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.milestone-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.milestone-card.completed .circle {
  background: #E9184C;
  color: white;
}

.milestone-card h3 {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.milestone-card p {
  color: #666;
  margin: 0 0 16px;
  font-size: 0.9rem;
}

.milestone-amount {
  font-weight: 500;
  color: #333;
}

.donate-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.gcash-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.qr-code {
  width: 200px;
  height: 200px;
  background: #f5f5f5;
  margin: 20px auto;
  border-radius: 8px;
}

.qr-instruction {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.how-to-donate h3 {
  margin-bottom: 16px;
}

.how-to-donate ol {
  padding-left: 20px;
}

.how-to-donate li {
  margin-bottom: 8px;
  color: #333;
}

.donors-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.donor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.donor:last-child {
  border-bottom: none;
}

.donor-info {
  display: flex;
  flex-direction: column;
}

.donor-name {
  font-weight: 500;
}

.donor-date {
  font-size: 0.9rem;
  color: #666;
}

.donation-amount {
  background: #ffebef;
  color: #E9184C;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.thank-you-message {
  background: #ffebef;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

.thank-you-message h2 {
  color: #E9184C;
  margin-bottom: 16px;
}

.thank-you-message p {
  color: #333;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .donate-section {
    grid-template-columns: 1fr;
  }

  .milestones {
    grid-template-columns: 1fr;
  }
}
</style>

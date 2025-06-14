<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Project Goals -->
    <div class="bg-white py-12 border-b shadow-sm">
      <div class="container max-w-6xl px-4 mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-4">Support Our Project</h1>
        <p class="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Help us reach our goals and build something amazing. Every contribution brings us closer to success.
        </p>

        <!-- Total Progress -->
        <div class="max-w-3xl mx-auto mb-8">
          <div class="flex justify-between items-end mb-2">
            <div>
              <span class="text-4xl font-bold" style="color: #E9184C">₱{{ totalCurrent.toLocaleString() }}</span>
              <span class="text-xl text-gray-600"> of ₱{{ totalTarget.toLocaleString() }}</span>
            </div>
            <span class="text-lg font-medium">{{ Math.round(overallProgress) }}% Complete</span>
          </div>
          <div class="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all" 
              style="background-color: #E9184C"
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Project Goals Circles - Hero Element -->
        <div class="relative py-16">
          <!-- Connection Line -->
          <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

          <!-- Goal Circles -->
          <div class="flex justify-between relative z-10">
            <div
              v-for="goal in projectGoals"
              :key="goal.id"
              class="flex flex-col items-center cursor-pointer transition-all duration-300"
              :class="{
                'scale-110': selectedGoal.id === goal.id,
                'hover:scale-105': selectedGoal.id !== goal.id
              }"
              @click="selectedGoal = goal"
            >
              <div
                class="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 transition-all"
                :class="{
                  'shadow-lg': selectedGoal.id === goal.id,
                  'bg-white': !goal.completed || selectedGoal.id === goal.id,
                  'text-white': goal.completed && selectedGoal.id !== goal.id
                }"
                :style="{
                  borderColor: selectedGoal.id === goal.id || goal.completed ? '#E9184C' : '#d1d5db',
                  backgroundColor: goal.completed && selectedGoal.id !== goal.id ? '#E9184C' : 'white',
                  boxShadow: selectedGoal.id === goal.id ? '0 10px 25px -3px rgba(233, 24, 76, 0.2)' : ''
                }"
              >
                <svg
                  v-if="goal.completed"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div v-else class="text-center">
                  <div class="text-lg font-bold">
                    {{ Math.round((goal.currentAmount / goal.targetAmount) * 100) }}%
                  </div>
                </div>
              </div>
              <div
                class="mt-4 text-center max-w-[120px] transition-all"
                :class="{
                  'font-bold': selectedGoal.id === goal.id
                }"
                :style="{
                  color: selectedGoal.id === goal.id ? '#E9184C' : ''
                }"
              >
                <p class="text-sm md:text-base">{{ goal.name }}</p>
                <p class="text-xs text-gray-600 mt-1 hidden md:block">{{ goal.description }}</p>
                <p class="text-xs font-medium mt-1">
                  ₱{{ goal.currentAmount.toLocaleString() }}/{{ goal.targetAmount.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Goal Details and Donation Info -->
    <div class="container max-w-6xl py-12 px-4 mx-auto">
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Left column: Selected Goal Details -->
        <div class="lg:col-span-2 flex flex-col">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden flex-grow">
            <div class="text-white p-6" style="background-color: #E9184C">
              <h2 class="text-2xl font-bold">{{ selectedGoal.name }}</h2>
              <p class="mt-2">{{ selectedGoal.description }}</p>
            </div>
            <div class="p-6 space-y-6 flex-grow">
              <div class="space-y-2">
                <div class="flex justify-between items-end">
                  <span class="text-3xl font-bold">₱{{ selectedGoal.currentAmount.toLocaleString() }}</span>
                  <span class="text-gray-600">of ₱{{ selectedGoal.targetAmount.toLocaleString() }}</span>
                </div>
                <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all" 
                    style="background-color: #E9184C"
                    :style="{ width: `${selectedGoalProgress}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-sm">
                  <span 
                    :class="selectedGoal.completed ? 'font-medium' : 'text-gray-600'"
                    :style="{ color: selectedGoal.completed ? '#E9184C' : '' }"
                  >
                    {{ selectedGoal.completed ? 'Goal Completed! 🎉' : `${Math.round(selectedGoalProgress)}% Complete` }}
                  </span>
                  <span class="text-gray-600">
                    ₱{{ (selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString() }} remaining
                  </span>
                </div>
              </div>

              <div class="space-y-4 flex-grow">
                <h3 class="text-xl font-semibold border-b pb-2">Donors ({{ selectedGoal.donors.length }})</h3>
                <div v-if="selectedGoal.donors.length > 0" class="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  <div
                    v-for="donor in selectedGoal.donors"
                    :key="donor.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img :src="donor.avatar" :alt="donor.name" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-medium">{{ donor.name }}</p>
                        <p class="text-xs text-gray-600">{{ donor.date }}</p>
                      </div>
                    </div>
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded border bg-white"
                      style="border-color: #E9184C; color: #E9184C"
                    >
                      ₱{{ donor.amount.toLocaleString() }}
                    </span>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
                  <p>No donors yet for this goal.</p>
                  <p class="text-sm">Be the first to contribute!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Thank you message - moved here and aligned -->
          <div class="mt-6 text-center space-y-4 p-6 rounded-lg" style="background-color: rgba(233, 24, 76, 0.1)">
            <h2 class="text-xl font-semibold" style="color: #E9184C">Thank You for Your Support!</h2>
            <p class="text-sm">
              Your generous donations help us achieve specific goals and make a real difference. Every contribution,
              no matter the size, brings us closer to completing our project milestones.
            </p>
          </div>
        </div>

        <!-- Right column: QR code and instructions -->
        <div class="flex flex-col">
          <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center flex-grow">
            <h2 class="text-xl font-semibold mb-4">Donate via GCash</h2>
            <div class="border-4 p-2 rounded-lg mb-4" style="border-color: #E9184C">
              <div class="w-[250px] h-[250px] bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </div>
            </div>
            <p class="text-center text-sm text-gray-600">
              Scan this QR code with your GCash app to donate
            </p>

            <div class="w-full mt-6 pt-6 border-t flex-grow">
              <h3 class="font-semibold mb-3">How to Donate</h3>
              <ol class="list-decimal pl-5 space-y-2 text-sm">
                <li>Open your GCash app</li>
                <li>Tap on "Scan QR" from the home screen</li>
                <li>Scan the QR code above</li>
                <li>Enter your donation amount</li>
                <li>Complete the transaction</li>
                <li>Message us with your name and which goal you're supporting</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Define interfaces using TypeScript-style objects
const projectGoals = ref([
  {
    id: 1,
    name: "Mobile Version",
    targetAmount: 25000,
    currentAmount: 25000,
    completed: true,
    description: "Develop a mobile app version",
    donors: [
      {
        id: 1,
        name: "Maria Santos",
        amount: 15000,
        date: "2025-06-10",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      { 
        id: 2, 
        name: "John Doe", 
        amount: 10000, 
        date: "2025-06-09", 
        avatar: "/placeholder.svg?height=40&width=40" 
      },
    ],
  },
  {
    id: 2,
    name: "Database",
    targetAmount: 35000,
    currentAmount: 30000,
    completed: false,
    description: "Set up a robust database system",
    donors: [
      {
        id: 3,
        name: "Sarah Johnson",
        amount: 20000,
        date: "2025-06-08",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 4,
        name: "Michael Chen",
        amount: 10000,
        date: "2025-06-07",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: 3,
    name: "Own Domain",
    targetAmount: 15000,
    currentAmount: 12000,
    completed: false,
    description: "Purchase and set up our own domain",
    donors: [
      { 
        id: 5, 
        name: "Anonymous", 
        amount: 7000, 
        date: "2025-06-06", 
        avatar: "/placeholder.svg?height=40&width=40" 
      },
      { 
        id: 6, 
        name: "Lisa Wong", 
        amount: 5000, 
        date: "2025-06-05", 
        avatar: "/placeholder.svg?height=40&width=40" 
      },
    ],
  },
  {
    id: 4,
    name: "Server Hosting",
    targetAmount: 50000,
    currentAmount: 8000,
    completed: false,
    description: "Secure dedicated server hosting for 1 year",
    donors: [
      { 
        id: 7, 
        name: "David Kim", 
        amount: 8000, 
        date: "2025-06-04", 
        avatar: "/placeholder.svg?height=40&width=40" 
      },
    ],
  },
  {
    id: 5,
    name: "Marketing",
    targetAmount: 40000,
    currentAmount: 0,
    completed: false,
    description: "Launch comprehensive marketing campaign",
    donors: [],
  },
])

const selectedGoal = ref(projectGoals.value[0])

// Computed properties
const totalTarget = computed(() => 
  projectGoals.value.reduce((sum, goal) => sum + goal.targetAmount, 0)
)

const totalCurrent = computed(() => 
  projectGoals.value.reduce((sum, goal) => sum + goal.currentAmount, 0)
)

const overallProgress = computed(() => 
  (totalCurrent.value / totalTarget.value) * 100
)

const selectedGoalProgress = computed(() => 
  (selectedGoal.value.currentAmount / selectedGoal.value.targetAmount) * 100
)
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Custom scrollbar for donor list */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #E9184C;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #d11544;
}
</style>
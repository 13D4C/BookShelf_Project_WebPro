<script lang="ts">
    import { onMount } from "svelte";
    import Navbar from "$lib/components/navbar.svelte"; // Import the Navbar
  
    interface Registration {
      userId: string;
      userName: string;
      userEmail: string;
      userPhone: string;
      dateOfBirth: string;
      status: "pending" | "approved" | "rejected";
      idCard: string; // Data URL of the ID card
      qrCode: string; //  Added qrCode field
      message?: string; // Optional message
      shopName?: string;
      shopDescription?: string;
    }
  
    // Mock Data (Replace with actual data fetching later)
    let registrations: Registration[] = [
      {
        userId: "1",
        userName: "user1",
        userEmail: "user1@example.com",
        userPhone: "0812345678",
        dateOfBirth: "1990-01-15",
        status: "pending",
        idCard: "https://preview.redd.it/r72kvnykeui41.png?auto=webp&s=6f903e95e64269773d4129a38194de0753d14a84", // Placeholder image
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // Placeholder QR code
        shopName: "Shop 1",
        shopDescription: "Description 1",
      },
      {
        userId: "2",
        userName: "user2",
        userEmail: "user2@example.com",
        userPhone: "0898765432",
        dateOfBirth: "1985-05-20",
        status: "pending",
        idCard: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // Placeholder image
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // Placeholder QR code
        shopName: "Shop 2",
        shopDescription: "Description 2",
        message: "Please provide a clearer ID card image.",
      },
        {
        userId: "3",
        userName: "user3",
        userEmail: "user3@example.com",
        userPhone: "0898765432",
        dateOfBirth: "1995-05-20",
        status: "approved",
        idCard: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // Placeholder image
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",  // Placeholder QR code
        shopName: "Shop 3",
        shopDescription: "Description 3",
        message: "Please provide a clearer ID card image.",
      },
    ];
  
    let selectedRegistration: Registration | null = null;
    let isLoading = false; //  Set to false since we're using mock data
    let error: string | null = null;
  
  
    // Mock functions (replace with actual API calls later)
    async function approveRegistration(userId: string) {
      // Find the registration and update its status (mock)
          const index = registrations.findIndex(reg => reg.userId === userId);
          if (index !== -1) {
            registrations[index].status = "approved";
             //For update svelte can detect change
            registrations = [...registrations];
          }
        alert(`Registration for user ${userId} approved (mock).`);
    }
  
    async function denyRegistration(userId: string) {
       const reason = prompt("Enter reason for denial (optional):");
      // Find the registration and update its status (mock)
       const index = registrations.findIndex(reg => reg.userId === userId);
          if (index !== -1) {
            registrations[index].status = "rejected";
            registrations[index].message = reason || undefined;
            //For update svelte can detect change
            registrations = [...registrations];
          }
  
      alert(`Registration for user ${userId} denied (mock).`);
    }
  
  
    function showDetails(registration: Registration) {
      selectedRegistration = registration;
    }
  
    function closeDetails() {
      selectedRegistration = null;
    }
  
    function calculateAge(dateOfBirth: string): number {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    }
  
  
    onMount(async () => {
      // No actual fetching needed in the mock version
    });
  
  </script>
  
  <Navbar /> <!-- Add the Navbar here -->
  <div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Seller Registration Review (Admin)</h1>
  
  {#if isLoading}
    <p>Loading registrations...</p>
  {:else if error}
    <p class="text-red-500">Error: {error}</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 border-b">Username</th>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Email</th>
            <th class="py-2 px-4 border-b">Phone</th>
            <th class="py-2 px-4 border-b">Age</th>
            <th class="py-2 px-4 border-b">Shop Name</th>
            <th class="py-2 px-4 border-b">Shop Description</th>
            <th class="py-2 px-4 border-b">Status</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each registrations as registration (registration.userId)}
            <tr class="hover:bg-gray-50">
              <td class="py-2 px-4 border-b">{registration.userName}</td>
              <td class="py-2 px-4 border-b">{registration.userName}</td>
              <td class="py-2 px-4 border-b">{registration.userEmail}</td>
              <td class="py-2 px-4 border-b">{registration.userPhone}</td>
              <td class="py-2 px-4 border-b">{calculateAge(registration.dateOfBirth)}</td>
              <td class="py-2 px-4 border-b">{registration.shopName}</td>
              <td class="py-2 px-4 border-b">{registration.shopDescription}</td>
  
              <td class="py-2 px-4 border-b">{registration.status}</td>
              <td class="py-2 px-4 border-b">
                <button
                  on:click={() => showDetails(registration)}
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Detail
                </button>
                {#if registration.status === 'pending'}
                  <button
                    on:click={() => approveRegistration(registration.userId)}
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    on:click={() => denyRegistration(registration.userId)}
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Deny
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  
  <!-- Modal for Details -->
  {#if selectedRegistration}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-2/3"> <!-- Increased modal width -->
        <h2 class="text-xl font-bold mb-4">Registration Details</h2>
        <div class="grid grid-cols-2 gap-4"> 
          <div>
            <p><strong>Username:</strong> {selectedRegistration.userName}</p>
            <p><strong>Name:</strong> {selectedRegistration.userName}</p>
            <p><strong>Email:</strong> {selectedRegistration.userEmail}</p>
            <p><strong>Phone:</strong> {selectedRegistration.userPhone}</p>
            <p><strong>Age:</strong> {calculateAge(selectedRegistration.dateOfBirth)}</p>
            <p><strong>Shop Name:</strong> {selectedRegistration.shopName}</p>
            <p><strong>Shop Description:</strong> {selectedRegistration.shopDescription}</p>
            <p><strong>Status:</strong> {selectedRegistration.status}</p>
            {#if selectedRegistration.message}
              <p><strong>Message:</strong> {selectedRegistration.message}</p>
            {/if}
          </div>
          <div>
            <p><strong>ID Card:</strong></p>
            <img src={selectedRegistration.idCard} alt="ID Card" class="max-w-full h-48 object-contain mb-4" />
  
            <p><strong>QR Code:</strong></p>
            <img src={selectedRegistration.qrCode} alt="QR Code" class="max-w-full h-48 object-contain" />
          </div>
        </div>
        <button
          on:click={closeDetails}
          class="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  {/if}
  </div>
  
  <style>
      /* Add some basic styles to the container (optional) */
      .p-4 {
          padding: 1rem; /* Example padding */
      }
  </style>
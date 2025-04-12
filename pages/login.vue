<script setup>
import { reactive } from 'vue';

const formData = reactive({
    name: '',
    password: ''
});

const login = async () =>
{

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        console.log(await response.json());
    } catch (e) {
        console.error(e);
    }

}

console.log("Hello, world");
</script>
<template>
  <div class="flex h-screen items-center justify-center mb-82">
    <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg max-w-md mx-auto transition-all duration-300 hover:shadow-xl hover:bg-opacity-90">
        <div class="mb-1.5">
          <label class="block text-gray-700" for="username">
            Navn
          </label>
          <div class="mt-1">
            <input  v-model="formData.name" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             required="" type="text" name="name" id="name">
          </div>
        </div>

        <div class="mb-1.5">
          <label class="block text-gray-700" for="username">
            Passord
          </label>
          <div class="mt-1">
            <input  v-model="formData.password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             required="" type="password" name="password" id="password">
          </div>
        </div>

        <div class="mt-6">
          <button @click="login" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit">
            login
          </button>
        </div>
    </div>
  </div>
</template>
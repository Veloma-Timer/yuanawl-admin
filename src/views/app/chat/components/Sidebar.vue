<template>
  <!-- Sidebar -->
  <aside class="flex h-full">
    <div class="flex w-60 flex-col overflow-y-auto bg-slate-50 pt-8 sm:w-64">
      <div class="flex">
        <h2 class="px-5 text-lg font-medium text-slate-800">
          消息列表
          <span class="mx-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-slate-200">6</span>
        </h2>
      </div>

      <!--搜索框-->
      <div class="p-2">
        <form>
          <label for="chat-input" class="sr-only">Search chats</label>
          <div class="relative">
            <input
              id="search-chats"
              type="text"
              class="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search chats"
              rows="1"
              required
            />
            <button
              type="submit"
              class="absolute bottom-2 right-2.5 rounded-lg p-2 text-sm text-slate-500 hover:text-blue-700 focus:outline-none sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                aria-hidden="true"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M8 9h8"></path>
                <path d="M8 13h5"></path>
                <path d="M11.008 19.195l-3.008 1.805v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"></path>
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M20.2 20.2l1.8 1.8"></path>
              </svg>
              <span class="sr-only">Search chats</span>
            </button>
          </div>
        </form>
      </div>
      <!-- Previous chats container -->
      <div class="space-y-4 overflow-y-auto border-b border-slate-300 px-2 py-4 h-[80%]">
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">Tailwind Classes</h1>
          <p class="text-xs text-slate-500">12 Mar</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg bg-slate-200 px-3 py-2 text-left transition-colors duration-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">explain quantum computing</h1>
          <p class="text-xs text-slate-500">10 Feb</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to create ERP Diagram</h1>
          <p class="text-xs text-slate-500">22 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">API Scaling Strategies</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">What is GPT UI?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to use Tailwind components?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to use Tailwind components?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to use Tailwind components?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to use Tailwind components?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to use Tailwind components?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
        <button
          class="flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-slate-200 focus:outline-none"
        >
          <h1 class="text-sm font-medium capitalize text-slate-700">How to use Tailwind components?</h1>
          <p class="text-xs text-slate-500">1 Jan</p>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped></style>

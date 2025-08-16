<!-- CardStats.vue -->
<template>
  <div class="card bg-white rounded-xl shadow-md p-6 border border-gray-100">
    <div class="flex items-center justify-between">
      <h3 class="text-gray-500 text-sm font-semibold">{{ title }}</h3>
      <slot name="icon"/>
    </div>
    <p class="text-2xl font-bold text-gray-900 mt-2">{{ mainValue }}</p>
    <div class="text-xs text-gray-600 mt-2">
      <p>{{ sub1 }}</p>
      <p>{{ sub2 }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  mainValue: String,
  sub1: String,
  sub2: String,
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}


.d-flex {
    display: flex !important;
}

.flex-fill {
    flex: 1 1 auto !important;
}

.card {
    box-shadow: 0 0.1875rem 0.1875rem 0 rgba(14,34,56,.07);
    margin-bottom: 1.875rem;
}

.card-body {
    color: var(--bs-card-color);
    flex: 1 1 auto;
    padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);
}

.w-100 {
    width: 100% !important;
}
.border-0 {
    border: 0 !important;
}

.row {
    --bs-gutter-x: 1.875rem;
    --bs-gutter-y: 0;
    display: flex;
    flex-wrap: wrap;
    margin-left: calc(var(--bs-gutter-x) * -.5);
    margin-right: calc(var(--bs-gutter-x) * -.5);
    margin-top: calc(var(--bs-gutter-y) * -1);
}

.col {
    flex: 1 0 0%;
}

.text-body-secondary {
    --bs-text-opacity: 1;
    color: var(--bs-secondary-color) !important;
}

.text-uppercase {
    text-transform: uppercase !important;
}

.fw-semibold {
    font-weight: 600 !important;
}
.mb-2 {
    margin-bottom: .46875rem !important;
}
.h5, h5 {
    font-size: .75rem;
}

.mb-0 {
    margin-bottom: 0 !important;
}

.fs-6 {
    font-size: .625rem !important;
}

.col-auto {
    flex: 0 0 auto;
    width: auto;
}

.text-primary {
    --bs-text-opacity: 1;
    color: rgba(0,186,199, var(--bs-text-opacity)) !important;
}

svg {
    touch-action: none;
}

img, svg {
    vertical-align: middle;
}

.card-footer:last-child {
    border-top-style: var(--tw-border-style);
    border-width: 1px;
}
.card-footer {
    background-color: var(--bs-card-cap-bg);
    border-top: var(--bs-card-border-width) solid var(--bs-card-border-color);
    color: var(--bs-card-cap-color);
    padding: var(--bs-card-cap-padding-y) var(--bs-card-cap-padding-x);
}

.justify-content-between {
    justify-content: space-between !important;
}

p {
    margin-bottom: 1.875rem;
    margin-top: 0;
}

.fw-bold, .fw-bolder {
    font-weight: 700 !important;
}
.fs-5 {
    font-size: .75rem !important;
}

.text-end {
    text-align: right !important;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

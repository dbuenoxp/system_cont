<template>
<div class="card border-0 flex-fill w-50">
    <div class="card-body">
        <div class="row">
            <div class="col">

                <!-- Title -->
                <h5 class="text-uppercase text-body-secondary fw-semibold mb-2">
                    {{ title }}
                </h5>

                <!-- Subtitle -->
                <h2 class="mb-0">
                    {{ mainValue }}
                </h2>
            </div>
            <div class="col-auto">

                <!-- Icon -->
                <svg viewBox="0 0 24 24" height="30" width="30" class="text-primary" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.250 6.000 A2.250 2.250 0 1 0 6.750 6.000 A2.250 2.250 0 1 0 2.250 6.000 Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4.5,9.75A3.75,3.75,0,0,0,.75,13.5v2.25h1.5l.75,6H6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.250 6.000 A2.250 2.250 0 1 0 21.750 6.000 A2.250 2.250 0 1 0 17.250 6.000 Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.5,9.75a3.75,3.75,0,0,1,3.75,3.75v2.25h-1.5l-.75,6H18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M9.000 3.750 A3.000 3.000 0 1 0 15.000 3.750 A3.000 3.000 0 1 0 9.000 3.750 Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.25,13.5a5.25,5.25,0,0,0-10.5,0v2.25H9l.75,7.5h4.5l.75-7.5h2.25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
            </div>
        </div> <!-- / .row -->
    </div>
    <div class="card-footer">
        <div class="row justify-content-between">
            <div class="col-auto">

                <!-- Label -->
                <p class="fs-6 text-body-secondary text-uppercase mb-0">
                    HOY
                </p>

                <!-- Comment -->
                <p class="fs-5 fw-bold mb-0">
                    {{ sub1 }}
                </p>
            </div>
            <div class="col text-end text-truncate">

                <!-- Label -->
                <p class="fs-6 text-body-secondary text-uppercase mb-0">
                    DEL MES
                </p>

                <!-- Comment -->
                <p class="fs-5 fw-bold mb-0">
                    {{ sub2 }}
                </p>
            </div>
        </div> <!-- / .row -->
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

.d-flex {
    display: flex !important;
}

.flex-fill {
    flex: 1 1 auto !important;
}

.card {
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.card-body {
    color: var(--bs-card-color);
    flex: 1 1 auto;
    padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);
}

.w-50 {
    width: 50% !important;
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

.card {
    --bs-card-spacer-y: 0.2500000001rem;
    --bs-card-spacer-x: 1.2500000001rem;
    --bs-card-title-spacer-y: 0.9375rem;
    --bs-card-title-color: ;
    --bs-card-subtitle-color: ;
    --bs-card-border-width: 1px;
    --bs-card-border-color: var(--bs-border-color-translucent);
    --bs-card-border-radius: var(--bs-border-radius);
    --bs-card-box-shadow: 0 0.1875rem 0.1875rem 0 rgba(14, 34, 56, .07);
    --bs-card-inner-border-radius: calc(0.625rem - 1px);
    --bs-card-cap-padding-y: 1.2500000001rem;
    --bs-card-cap-padding-x: 1.2500000001rem;
    --bs-card-cap-bg: transparent;
    --bs-card-cap-color: ;
    --bs-card-height: ;
    --bs-card-color: ;
    --bs-card-bg: #fff;
    --bs-card-img-overlay-padding: 1.875rem;
    --bs-card-group-margin: 0.9375rem;
    color: var(--bs-body-color);
    display: flex;
    flex-direction: column;
    height: var(--bs-card-height);
    min-width: 0;
    position: relative;
    word-wrap: break-word;
    background: linear-gradient(90deg, rgb(209 225 250) 0%, rgb(249 224 198) 50%, rgb(249 206 190) 100%);
    background-clip: border-box;
    background-color: lightblue;
    border: var(--bs-card-border-width) solid var(--bs-card-border-color);
    /* border-radius: var(--bs-card-border-radius); */
}
</style>
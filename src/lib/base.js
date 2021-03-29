// xcopy /e /y dist D:\Programas\laragon\www\geocimat-backend\public && xcopy /y dist\index.html D:\Programas\laragon\www\geocimat-backend\resources\views\geocimat\index.blade.php
// document.querySelector('[name="_token"]')?.value;
const axios = require('axios');
const config = { 'X-CSRF-TOKEN': window.Laravel.token };
const baseURL = '';
// const baseURL = 'http://127.0.0.1:8000';
// const baseURL = "http://localhost:8000";
// const baseURL = 'https://geocimat.herokuapp.com';

export { axios, baseURL, config };

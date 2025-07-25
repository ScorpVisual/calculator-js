// nav.js
console.log('nav.js loaded');

document.addEventListener('DOMContentLoaded', () => {




   const startPage = document.getElementById('start-page');
   const checkOutfitPage = document.getElementById('check-outfit-page');
   const checkPetPage = document.getElementById('check-pet-page');   
   const checkAssetPage = document.getElementById('check-asset-page');
   const checkRulesPage = document.getElementById('check-rules-page');

 startPage?.addEventListener('click', () => {
    window.location.href = 'index.html';
 });      
 checkOutfitPage?.addEventListener('click', () => {
    window.location.href = 'check-outfit.html';
    
 });      
 checkPetPage?.addEventListener('click', () => {
    window.location.href = 'check-pet.html';
 });      
 checkAssetPage?.addEventListener('click', () => {
    window.location.href = 'check-asset.html';
 });      
 checkRulesPage?.addEventListener('click', () => {
    window.location.href = 'check-rules.html';
 });      

});
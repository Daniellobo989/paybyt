
function navigateTo(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function buyProduct(productName, productPrice) {
    navigateTo('escrow');
    const escrowDetails = document.getElementById('escrow-details');
    escrowDetails.textContent = `Você comprou ${productName} por ${productPrice} BTC. O pagamento está em escrow.`;
}

function confirmDelivery() {
    alert('Recebimento confirmado! Pagamento liberado ao vendedor.');
    navigateTo('products');
}

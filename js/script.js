document.addEventListener("DOMContentLoaded", function () {

    // Contact form submission
    const contactForm = document.getElementById("contactForm");
    const contactResponse = document.getElementById("contactResponse");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch("/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (result.success) {
                    contactResponse.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
                    contactForm.reset();
                } else {
                    contactResponse.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
                }
            } catch (err) {
                contactResponse.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
            }
        });
    }

    //Signup form handling

const signupForm = document.getElementById("signupForm");
const signupResponse = document.getElementById("signupResponse");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        console.log("Signup form submit triggered")

        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                signupResponse.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
                signupForm.reset();
            } else {
                signupResponse.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
            }
        } catch (err) {
            signupResponse.innerHTML = `<div class="alert alert-danger">Signup failed.</div>`;
        }
    });
}

    // Cart Functionality
    console.log("Script loaded and DOM is ready.");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartModalEl = document.getElementById("cartModal");
    const cartModal = new bootstrap.Modal(cartModalEl);

    function updateCartCount() { document.getElementById("cart-count").innerText = cart.length; }
    function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

    function addToCart(name, price) {
        let existingItem = cart.find(item => item.name === name);
        if (existingItem) existingItem.quantity += 1;
        else cart.push({ name, price, quantity: 1 });
        saveCart(); updateCartCount();
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            addToCart(this.getAttribute("data-name"), parseFloat(this.getAttribute("data-price")));
        });
    });

    function renderCart() {
        let cartItemsDiv = document.getElementById("cart-items");
        let total = 0;
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = `<p class="text-center mb-0">Your cart is empty.</p>`;
            document.getElementById("cart-total").innerText = 0;
            return;
        }
        cartItemsDiv.innerHTML = "";
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItemsDiv.innerHTML += `
                <div class="d-flex justify-content-between align-items-center">
                    <div><strong>${item.name}</strong><br>R${item.price} x ${item.quantity}</div>
                    <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
                </div><hr>`;
        });
        document.getElementById("cart-total").innerText = total;
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", function () { removeItem(this.getAttribute("data-index")); });
        });
    }

    function viewCart() { renderCart(); cartModal.show(); }
    function removeItem(index) { cart.splice(index, 1); saveCart(); updateCartCount(); renderCart(); if(cart.length===0) cartModal.hide(); }

    window.viewCart = viewCart;
    window.clearCart = function() { cart = []; saveCart(); updateCartCount(); renderCart(); cartModal.hide(); }

    cartModalEl.addEventListener("hidden.bs.modal", () => {
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
    });

    updateCartCount();
});
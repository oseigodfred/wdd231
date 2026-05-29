// timestamp

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("timestamp").value =
        new Date().toISOString();

    const links =
        document.querySelectorAll("[data-modal]");

    links.forEach(link => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const modalId =
                link.dataset.modal;

            document
                .getElementById(modalId)
                .showModal();
        });
    });

    const closeButtons =
        document.querySelectorAll(".closeBtn");

    closeButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            btn.closest("dialog").close();
        });
    });

});
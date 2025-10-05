document.addEventListener('DOMContentLoaded', () => {
  const selects = document.querySelectorAll('select[data-user-id]');

  selects.forEach(select => {
    select.addEventListener('change', async (event) => {
      const userId = select.getAttribute('data-user-id');
      const newRole = event.target.value;

      try {
        const response = await fetch(`/admin/users/${userId}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: newRole })
        });

        const data = await response.json();
        if (data.success) {
          select.style.border = '2px solid green';
          setTimeout(() => select.style.border = '', 1000);
        } else {
          alert("Erreur lors de la mise à jour du rôle");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur de connexion au serveur");
      }
    });
  });
});

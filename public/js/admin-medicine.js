document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. CREATE MEDICINE LOGIC
  // =========================================================
  const createMedicineForm = document.getElementById('createMedicineForm');

  if (createMedicineForm) {
    createMedicineForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(createMedicineForm);

      try {
        const response = await fetch('/admin/medicines', {
          method: 'POST',
          body: formData, // Auto-sets Content-Type to multipart/form-data
        });

        if (response.ok) {
          const btn = document.querySelector('.addBtn');
          const originalText = btn.innerText;

          // Visual feedback
          btn.innerText = 'Medicine Created!';
          btn.style.backgroundColor = 'var(--success)';

          setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = 'var(--primary)';
            createMedicineForm.reset();
            window.location.reload(); // Refresh to see the new item
          }, 1500);
        } else {
          const errorText = await response.text();
          alert('Failed: ' + errorText);
        }
      } catch (error) {
        console.log('Network error:', error);
      }
    });
  }

  // =========================================================
  // 2. DELETE MEDICINE LOGIC
  // =========================================================
  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  let deleteId = null; // Store ID to delete

  // A. Attach Click Event to all "Trash" icons
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteId = btn.dataset.id; // Get ID from the data-id attribute
      deleteModal.showModal(); // Open the dialog
    });
  });

  // B. Close Modal on Cancel
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.close();
      deleteId = null;
    });
  }

  // C. Perform Delete on Confirm
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!deleteId) return;

      try {
        const response = await fetch(`/admin/medicines/${deleteId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the row from the table immediately
          const row = document.getElementById(`row-${deleteId}`);
          if (row) row.remove();
          deleteModal.close();
        } else {
          alert('Failed to delete medicine.');
        }
      } catch (err) {
        console.error('Error deleting:', err);
      }
    });
  }

  // =========================================================
  // 3. UPDATE MEDICINE LOGIC
  // =========================================================
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editMedicineForm');
  const closeEditBtn = document.getElementById('closeEditBtn');

  // A. Attach Click Event to all "Pencil" icons
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Populate the form fields with data from the button's attributes
      document.getElementById('editId').value = btn.dataset.id;
      document.getElementById('editName').value = btn.dataset.name;
      document.getElementById('editCompany').value = btn.dataset.company;
      document.getElementById('editPrice').value = btn.dataset.price;
      document.getElementById('editStock').value = btn.dataset.stock;

      editModal.showModal();
    });
  });

  // B. Close Edit Modal
  if (closeEditBtn) {
    closeEditBtn.addEventListener('click', () => editModal.close());
  }

  // C. Submit Edit Form
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('editId').value;
      const formData = new FormData(editForm); // Handles text AND file

      try {
        const response = await fetch(`/admin/medicines/${id}`, {
          method: 'PUT', // Using PUT for updates
          body: formData,
        });

        if (response.ok) {
          window.location.reload(); // Reload to show new data/image
        } else {
          const error = await response.json();
          alert('Update failed: ' + (error.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error updating:', err);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("project-list");
    const token = localStorage.getItem("token");
  
    if (!token) {
      container.innerHTML = `<p class="text-red-600 text-center">No autorizado. Por favor inicia sesión.</p>`;
      return;
    }
  
    fetch("http://localhost:8080/api/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la lista de proyectos.");
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          container.innerHTML = `<p class="text-gray-500 text-center">No hay proyectos disponibles.</p>`;
          return;
        }
  
        data.forEach(project => {
          const card = document.createElement("div");
          card.className = "transform transition-transform duration-500 hover:scale-105 will-change-transform hover:-translate-y-1 max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6";
  
          const wordLimit = 25;
          const descriptionWords = project.description.split(" ");
          const shouldTruncate = descriptionWords.length > wordLimit;
          const shortDescription = shouldTruncate
            ? descriptionWords.slice(0, wordLimit).join(" ") + "..."
            : project.description;
  
          card.innerHTML = `
            <div class="p-6">
              <div class="text-sm text-gray-500 mb-2">
                <span class="font-medium">ID:</span> ${project.id}
              </div>
              <h2 class="text-2xl font-semibold text-gray-800 mb-2">${project.title}</h2>
  
              <p class="text-gray-600 mb-2 description">
                ${shortDescription}
              </p>
              ${
                shouldTruncate
                  ? `<button class="text-blue-600 hover:underline text-sm toggle-btn" data-full="${project.description.replace(/"/g, '&quot;')}" data-short="${shortDescription}">Mostrar más</button>`
                  : ""
              }
  
              <div class="mb-4 mt-3">
                <span class="font-medium text-gray-700">Repositorio:</span>
                <a href="${project.repoLink}" class="text-blue-600 hover:underline break-all" target="_blank">
                  ${project.repoLink}
                </a>
              </div>
  
              <div class="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-3">
                <div>
                  <span class="font-medium">Grupo:</span> ${project.group.name}
                </div>
                <div>
                  <span class="font-medium">Líder:</span> ${project.group.leader.firstName} ${project.group.leader.lastName}
                </div>
                <div>
                  <span class="font-medium">Estado:</span>
                  <span class="inline-block px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-semibold">
                    ${project.status}
                  </span>
                </div>
                <div>
                  <span class="font-medium">Creado:</span> ${new Date(project.createdAt).toLocaleString()}
                </div>
                <div>
                  <span class="font-medium">Actualizado:</span> ${new Date(project.updatedAt).toLocaleString()}
                </div>
  
                <a href="/projects/${project.repoLink}" class="col-span-2 inline-block bg-[#1BAA7D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1bc632] transition duration-300 text-center mt-2">
                  Repositorio
                </a>
              </div>
            </div>
          `;
  
          container.appendChild(card);
        });
  
        // Funcionalidad de "Mostrar más / Mostrar menos"
        document.querySelectorAll(".toggle-btn").forEach((btn) => {
          const desc = btn.previousElementSibling;
          const fullText = btn.dataset.full;
          const shortText = btn.dataset.short;
  
          let expanded = false;
  
          btn.addEventListener("click", () => {
            expanded = !expanded;
            desc.textContent = expanded ? fullText : shortText;
            btn.textContent = expanded ? "Mostrar menos" : "Mostrar más";
          });
        });
      })
      .catch(error => {
        console.error("Error:", error);
        container.innerHTML = `<p class="text-red-600 text-center">Error al cargar proyectos: ${error.message}</p>`;
      });
  });
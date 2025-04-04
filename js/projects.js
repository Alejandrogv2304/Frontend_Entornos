const container = document.getElementById("project-list");

fetch("http://localhost:8080/api/projects")
  .then(res => res.json())
  .then(data => {
    data.forEach(project => {
      const card = document.createElement("div");
card.className = "max-w-md bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow p-6 mb-4";

card.innerHTML = `
  <div class="text-sm text-gray-500 mb-2">
    <span class="font-medium">ID:</span> ${project.id}
  </div>
  <h2 class="text-xl font-semibold text-gray-800 mb-1">${project.title}</h2>
  <p class="text-gray-600 mb-3">${project.description}</p>
  
  <div class="mb-2">
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
      <span class="inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">${project.status}</span>
    </div>
    <div>
      <span class="font-medium">Creado:</span> ${new Date(project.createdAt).toLocaleString()}
    </div>
    <div>
      <span class="font-medium">Actualizado:</span> ${new Date(project.updatedAt).toLocaleString()}
    </div>
  </div>
`;

container.appendChild(card);

    });
  })
  .catch(error => {
    container.innerHTML = `<p class="text-red-600 text-center">Error al cargar proyectos: ${error.message}</p>`;
  });

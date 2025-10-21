// Espera o HTML da página carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // 1. Busca a lista de clientes do localStorage
    const clientes = JSON.parse(localStorage.getItem('clientes'));

    // 2. Seleciona o container onde os cards serão inseridos
    const userListContainer = document.getElementById('user-list-container');

    // 3. Limpa qualquer conteúdo estático que possa estar dentro
    userListContainer.innerHTML = ''; 

    // 4. Verifica se a lista de clientes existe e tem itens
    if (clientes && clientes.length > 0) {
        
        // 5. Para cada cliente na lista, cria o HTML do card
        clientes.forEach(cliente => {
            
            // Cria um elemento 'a' (link)
            const link = document.createElement('a');
            link.href = 'servico.html'; // Link para a página de serviço

            // Cria o HTML interno do card usando os dados do cliente
            // (Copiei a estrutura exata do seu HTML)
            link.innerHTML = `
                <div class="user-card">
                    <div class="user-info">
                        <span class="user-name">${cliente.nome}</span>
                        <span class="user-id">${cliente.cpf}</span>
                    </div>
                    <div class="user-actions">
                        <button class="action-btn edit-btn" aria-label="Editar">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                        </button>
                        <button class="action-btn delete-btn" aria-label="Excluir">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                        <button class="action-btn paper-bnt">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <g clip-path="url(#clip0_22_172)">
                                    <path d="M20 16L15 21L16.4 22.45L19 19.85V28H21V19.85L23.6 22.45L25 21L20 16ZM14 12C13.45 12 12.9792 12.1958 12.5875 12.5875C12.1958 12.9792 12 13.45 12 14V17H14V14H26V17H28V14C28 13.45 27.8042 12.9792 27.4125 12.5875C27.0208 12.1958 26.55 12 26 12H14Z" fill="#49454F"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_22_172">
                                        <rect width="40" height="40" rx="20" transform="matrix(1 0 0 -1 0 40)" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            // 6. Adiciona o link (com o card dentro) ao container
            userListContainer.appendChild(link);
        });

    } else {
        // 7. Se não houver clientes, mostra uma mensagem simples
        userListContainer.innerHTML = '<p style="color: white; text-align: center;">Nenhum cliente cadastrado ainda.</p>';
    }
});
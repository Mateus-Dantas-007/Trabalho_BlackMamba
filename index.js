document.addEventListener('DOMContentLoaded', function() {

    const clientes = JSON.parse(localStorage.getItem('clientes'));
    const userListContainer = document.getElementById('user-list-container');

    userListContainer.innerHTML = ''; 

    if (clientes && clientes.length > 0) {
        
        clientes.forEach(cliente => {
            
            const link = document.createElement('a');
            link.href = 'servico.html'; 

            link.addEventListener('click', function() {
                sessionStorage.setItem('cpfClienteParaServico', cliente.cpf);
                sessionStorage.removeItem('modoServico'); 
            });

            link.innerHTML = `
                <div class="user-card">
                    <div class="user-info">
                        <span class="user-name">${cliente.nome}</span>
                        <span class="user-id">${cliente.cpf}</span>
                    </div>
                    <div class="user-actions">
                        <button class="action-btn edit-btn" aria-label="Editar" data-cpf="${cliente.cpf}">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                        </button>

                        <button class="action-btn delete-btn" aria-label="Excluir" data-cpf="${cliente.cpf}">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                        
                        <button class="action-btn paper-bnt" data-cpf="${cliente.cpf}">
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
            
            userListContainer.appendChild(link);
        });

        adicionarLogicaDeExclusao();
        adicionarLogicaDeEdicao();
        adicionarLogicaDeExportacao(); // <-- NOVA FUNÇÃO CHAMADA

    } else {
        userListContainer.innerHTML = '<p style="color: black; text-align: center;">Nenhum cliente cadastrado ainda.</p>';
    }
});


function adicionarLogicaDeExclusao() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            event.stopPropagation(); 
            const confirmou = confirm('Tem certeza que deseja excluir este cliente?');
            if (confirmou) {
                const cpfParaDeletar = event.currentTarget.dataset.cpf;
                let clientesAtuais = JSON.parse(localStorage.getItem('clientes')) || [];
                let novosClientes = clientesAtuais.filter(cliente => cliente.cpf !== cpfParaDeletar);
                localStorage.setItem('clientes', JSON.stringify(novosClientes));
                window.location.reload();
            }
        });
    });
}

function adicionarLogicaDeEdicao() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            const cpfParaEditar = event.currentTarget.dataset.cpf;
            sessionStorage.setItem('cpfClienteParaServico', cpfParaEditar);
            sessionStorage.setItem('modoServico', 'editar'); 
            window.location.href = 'servico.html';
        });
    });
}

// --- FUNÇÃO NOVA ---
function adicionarLogicaDeExportacao() {
    // 1. Pega a biblioteca que carregamos no HTML
    const { jsPDF } = window.jspdf;
    
    // 2. Seleciona todos os botões de exportar
    const exportButtons = document.querySelectorAll('.paper-bnt');

    exportButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // 3. Impede a navegação e a "borbulha"
            event.preventDefault();
            event.stopPropagation();

            // 4. Pega o CPF do botão
            const cpfParaExportar = event.currentTarget.dataset.cpf;
            
            // 5. Pega os dados do localStorage
            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const cliente = clientes.find(c => c.cpf === cpfParaExportar);

            // 6. VERIFICA SE EXISTE SERVIÇO
            if (!cliente) {
                alert('Erro: Cliente não encontrado.');
                return;
            }

            if (!cliente.servico) {
                alert('Este cliente ainda não possui um serviço cadastrado para exportar.');
                return;
            }

            // 7. GERA O PDF
            try {
                const doc = new jsPDF();
                
                // Formata os dados
                const valorFormatado = parseFloat(cliente.servico.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                const dataFormatada = new Date(cliente.servico.data_conclusao + 'T00:00:00').toLocaleDateString('pt-BR');

                // Adiciona o conteúdo
                doc.setFontSize(18);
                doc.text("Relatório de Serviço", 10, 20);

                doc.setFontSize(12);
                doc.text(`Cliente: ${cliente.nome}`, 10, 35);
                doc.text(`CPF: ${cliente.cpf}`, 10, 42);
                doc.text(`Veículo: ${cliente.modelo}`, 10, 49); // <-- Pega o modelo salvo no cadastro

                doc.setFontSize(14);
                doc.text("Detalhes do Serviço", 10, 65);
                doc.setFontSize(12);
                
                // Quebra a descrição em várias linhas se for longa
                const linhasDescricao = doc.splitTextToSize(cliente.servico.descricao, 180);
                doc.text(linhasDescricao, 10, 75);

                // Calcula onde a próxima linha deve começar
                let yOffset = 75 + (linhasDescricao.length * 7);

                doc.text(`Valor: ${valorFormatado}`, 10, yOffset + 5);
                doc.text(`Status: ${cliente.servico.status}`, 10, yOffset + 12);
                doc.text(`Data Prevista: ${dataFormatada}`, 10, yOffset + 19);

                // 8. Salva o arquivo
                doc.save(`servico-${cliente.cpf}.pdf`);

            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                alert('Ocorreu um erro ao gerar o PDF.');
            }
        });
    });
}
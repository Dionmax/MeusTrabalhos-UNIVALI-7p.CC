describe('Engenharia', () => {

    it('Acessando o site: acessat o site', () => {
        cy.visit('https://todolistme.net/')
    })

    it('Fechando e deletando: fechar todos as tasks, e deletar ela no fim', () => {
        cy.get('#mytodos > li').each((value, key) => {
            cy.get('#todo_' + key + ' > input').not('[disabled]')
                .check().should('be.checked')

            cy.wait(500)
        })
        cy.get('.purge > img').click()

        cy.get('#mytodos').should('not.contain', 'Howdy. Let\'s get you up and running.')
    })

    it('Criando novas tarefas: criar novas tasks de teste', () => {
        for (let index = 0; index < 5; index++) {
            cy.get('#newtodo').type('Teste ' + (index + 1) + '{enter}')
        }

        cy.get('#mytodo_0').should('contain', 'Teste 1')
    })

    it('Pecorrendo listas: pecorrer todos os projetos', () => {
        cy.get('#container_0 > li').each((value, key) => {
            cy.get('#list_'+key).click()
            cy.wait(1000)
        })
    })

    it('Criando nova lista: criar um novo projeto', () => {
        cy.get('#addlist').click()
        cy.get('#updatebox').type('Nova lista{enter}')

        cy.get('#list_5').should('contain', 'Nova lista')
    })

    it('Inserindo dados na nova lista: colocar tarefas nas lista nova', () => {
        for (let index = 0; index < 5; index++) {
            cy.get('#newtodo').type('Nova tarefa ' + (index + 1) + '{enter}')
        }

        cy.get('#mytodo_0').should('contain', 'Nova tarefa 1')
    })

    it('Check novas tarefas: confirmar todas as tarefas criadas', () => {
        cy.get('#mytodos > li').each((value, key) => {
            cy.get('#todo_' + key + ' > input').not('[disabled]')
                .check().should('be.checked')
            cy.wait(500)
        })

        cy.get('#mytodos').should('not.contain', '#mytodo_0')
    })

    it('Resetando e desfazendo: resetar a página e desfazer o resete', () => {
        cy.get('[onclick="verify_reset_lists();"]').click()

        cy.wait(1000)

        cy.get('#undotab > img').click()
    })

    it('Mudar página e voltar: mudar para outra página e voltar para anterior com o botão voltar', () => {
        cy.get('[href="./mobile.php"]').click()

        cy.wait(1000)

        cy.url().should('include', '/mobile.php')

        cy.scrollTo('600px')

        cy.get('#backbutton').click()

        cy.wait(1000)
    })

    it('Tentar recuperar conta: tentar recuperar a conta com um e-mail inválido', () => {
        cy.get('#sync_icon').click()

        cy.get('#loginpanel > .forms > :nth-child(4) > a').click()

        cy.url().should('include', '/usermanager.php?action=reset')

        cy.get('#sync_email').type('testes@testes.com.br')

        cy.get('form > :nth-child(3) > input').click()

        cy.wait(1000)

        cy.get('#backbutton').click()

        cy.url().should('not.include', '/app')
    })
})
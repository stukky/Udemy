
/// <reference types="cypress" />

describe('Test with backend', () => {

    beforeEach('Login to the app', () => {

        //cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
        cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' })
        cy.loginToApplication()
    })
    it('verify correct request and response', () => {

        cy.intercept('POST', '**/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"').type('This is a title')
        cy.get('[placeholder="What\'s this article about?"]').type('This is  description')
        cy.get('[placeholder="Write your article (in markdown)"]').type('This is the of Article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr);
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is the of Article')
            expect(xhr.response.body.article.describtion).to.equal('This is  description')
        })
    });
    it('intercepting and modifying the request and response', () => {

        // cy.intercept('POST', '**/articles', (req)=>{
        //     req.body.article.description = 'This is  description 2'
        // }).as('postArticles')
        cy.intercept('POST', '**/articles', (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('This is description')
            })
        }).as('postArticles')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"').type('This is a title2')
        cy.get('[placeholder="What\'s this article about?"]').type('This is description')
        cy.get('[placeholder="Write your article (in markdown)"]').type('This is the of Article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr);
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is the of Article')
            expect(xhr.response.body.article.description).to.equal('This is description')
        })
    });
    it.only('Should gave tags with routing object ', () => {
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'testing')

    });
    it('verify global feed likes count', () => {
        cy.intercept('GET', '**/articles/feed', { "articles": [], "articlesCount": 0 })
        cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })

        cy.contains(' Global Feed ').click()

        cy.get('app-article-list button').then(listOfButtons => {
            expect(listOfButtons[1]).to.contain('0')
            expect(listOfButtons[3]).to.contain('732')
        })

        cy.fixture("articles").then(file => {
            const articleLink = file.articles[1].slug
            //https://api.realworld.io/api/articles/This-is-a-title-10836/favorite
            cy.intercept('POST', '**/article' + articleLink + '/favorite', file).as('post1')
        })
        //valami hiba van ezzel. DELETE hívás jön, nem tudni miért és üres lesz a Global Feed
        //    cy.get('app-article-list button').eq(0).click().should('contain', '1')
    });
    it('delete a new article in global feed', () => {
        const userData = {
            "user": {
                "email": "stuky19@gmail.com",
                "password": "Teszt012"
            }
        }
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "request from API",
                "description": "API testing is easy",
                "body": "Angular is cool"
            }
        }

        cy.request('POST', Cypress.env('apiUrl')+'/api/users/login', userData)
            .its('body').then(body => {
                const token = body.user.token

                cy.request({
                    url: Cypress.env('apiUrl')+'/api/articles/',
                    headers: {'Authorization': 'Token ' + token},
                    method: 'POST',
                    boddy: bodyRequest
                }).then( response =>{
                    expect(response.status).to.equal(200)
                })
        })

        cy.contains('Global Feed').click()
        cy.get('.article-preview').first().click()
        cy.get('.article-actions').containc('Delete Aticle').click()

        cy.request({
            url: Cypress.env('apiUrl')+'/api/articles?limit=10&offset=0',
            headers: {'Authorization': 'Token ' + token},
            method: 'GET'
        }).its('body').then( body =>{
            expect(body.articles[0].title).not.to.equal('request from API')
        })

    });
})
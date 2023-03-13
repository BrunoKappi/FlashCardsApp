const FlipCards = [
    {
        Id: '1',
        Type: 'Text',
        Question: 'Qual a capital do Brasil?',
        Answer: { Id: 3, Option: 'Brasilia', IsAnswer: true },
        Options: []
    },
    {
        Id: '2',
        Type: 'MultipleChoice',
        Question: 'Qual a capital do Brasil?',
        Answer: { Id: 3, Option: 'Brasilia', IsAnswer: true },
        Options: [
            { Id: 1, Option: 'Curitiba', IsAnswer: false }, { Id: 2, Option: 'Porto Seguro', IsAnswer: false }, { Id: 3, Option: 'Brasilia', IsAnswer: true }, { Id: 4, Option: 'Manaus', IsAnswer: false }
        ]
    }, {
        Id: '1',
        Type: 'Text',
        Question: 'Qual a capital do Brasil?',
        Answer: { Id: 3, Option: 'Brasilia', IsAnswer: true },
        Options: []
    },{
        Id: '1',
        Type: 'Text',
        Question: 'Qual a capital do Brasil?',
        Answer: { Id: 3, Option: 'Brasilia', IsAnswer: true },
        Options: []
    },
]


const CardsDefault = [
    {
        Index: 1,
        Id: 'sasasas21322',
        Name: 'Programação Front-End Programação Front-End',
        Cards: FlipCards
    },
    {
        Index: 2,
        Id: 'sasasasss21322',
        Name: 'ReactJs',
        Cards: FlipCards
    },
    {
        Index: 3,
        Id: 'sawqqwsasas21322',
        Name: 'História',
        Cards: FlipCards
    },
    
]



const CardsDefault2 = [

]

const Cards = (state = CardsDefault2, action) => {
    switch (action.type) {
        case 'CLEAR_CARDS':
            return CardsDefault
        case 'ADD_CATEGORY':
            return state.concat(action.Category)
        case 'EDIT_CATEGORY':
            return state.filter(Cat => Cat.Id !== action.Category.Id).concat(action.Category)
        case 'DELETE_CATEGORY':
            var X = (state.length - 1)
            return state.filter(Cat => Cat.Id !== action.Category.Id).map(Cat => { return { ...Cat, Index: --X } })
        case 'SET_CARDS':
            return action.Cards
        default:
            return state
    }
}

export default Cards

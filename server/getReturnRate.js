const rates = [
    {
        "min": 0,
        "max": 1,
        "rate": 0.8
    },
    {
        "min": 1,
        "max": 2,
        "rate": 0.75
    },
    {
        "min": 2,
        "max": 5,
        "rate": 0.7
    },
    {
        "min": 5,
        "max": 8,
        "rate": 0.65
    },
    {
        "min": 8,
        "max": 12,
        "rate": 0.62
    },
    {
        "min": 12,
        "max": 20,
        "rate": 0.6
    },
    {
        "min": 20,
        "max": 30,
        "rate": 0.55
    },
    {
        "min": 30,
        "max": 50,
        "rate": 0.5
    },
    {
        "min": 50,
        "max": 80,
        "rate": 0.45
    },
    {
        "min": 80,
        "max": 100,
        "rate": 0.4
    },
    {
        "min": 100,
        "max": 200,
        "rate": 0.35
    },
    {
        "min": 200,
        "max": 400,
        "rate": 0.3
    },
    {
        "min": 400,
        "max": 800,
        "rate": 0.25
    },
    {
        "min": 800,
        "max": 1000,
        "rate": 0.2
    },
    {
        "min": 1000,
        "max": 2000,
        "rate": 0.15
    },
    {
        "min": 2000,
        "max": 50000,
        "rate": 0.1
    }
]

const getRate = (fee)=>{
    for(let i=0;i<rates.length;i++){
        const rate = rates[i]
        if(fee>=rate.min && fee<rate.max){
            return rate.rate
        }
    }
    return 0.6
} 

module.exports = getRate 

const jokeCard = document.getElementById('jokeCard');
const jokeTxt = document.getElementById('jokeTxt');
let isFlipped = false;
let isLoading = false;

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';

async function fetchNewJoke() {
    try {
        isLoading = true;
        jokeTxt.textContent = '🤔 Fetching joke...';
        
        const response = await fetch(JOKE_API_URL);
        const data = await response.json();
        
        if (data.error) {
            throw new Error('API error');
        }
        
        // to handling both single and two-part jokes
        let joke = '';
        if (data.type === 'single') {
            joke = data.joke;
        } else if (data.type === 'twopart') {
            joke = `${data.setup}\n\n${data.delivery}`;
        }
        
        jokeTxt.textContent = joke;
        isLoading = false;
        
    } catch (error) {
        console.error('Failed to fetch joke:', error);
        jokeTxt.textContent = 'Failed to load joke. Tap to retry.';
        isLoading = false;
    }
}

function handleCardClick() {
    if (!isFlipped) {
        // Flipping to card back to show the joke
        // Only fetch a new joke if current one is placeholder or error
        const currentText = jokeTxt.textContent;
        if (currentText === 'Loading...' || 
            currentText === 'Oops! Failed to load joke. Tap to retry.' ||
            currentText.includes('Fetching')) {
            fetchNewJoke();
        }
        
        jokeCard.classList.add('flipped');
        isFlipped = true;
        
    } else {
        jokeCard.classList.remove('flipped');
        isFlipped = false;
        
        // Pre-fetch next joke in background for instant response next time
        setTimeout(() => {
            if (!isFlipped) {
                fetchNewJoke();
            }
        }, 300);
    }
}

// Load initial joke in background (not showing yet)
fetchNewJoke();

// Add click event listener
jokeCard.addEventListener('click', handleCardClick);
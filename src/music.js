import music from "./assets/musique.mp3" 

const sound = new Audio(music)
sound.loop = true
sound.volume = 0.5

document.getElementById('startButton').addEventListener('click', function () {
    sound.play()
})

document.getElementById('stopButton').addEventListener('click', function () {
    sound.pause()
    sound.currentTime = 0
})
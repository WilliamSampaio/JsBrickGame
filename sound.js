const music = document.createElement('audio')
music.setAttribute('display', 'none')
music.src = 'Tetris-99-Main-Theme.mp3'
music.preload = 'auto'
music.controls = false
music.loop = true
music.volume = .8

document.body.appendChild(music)

$("#muteAudioControl").attr('checked', music.muted)

$("#muteAudioControl").on('click', () => {
    music.muted = !music.muted
    if (music.muted) {
        $("#musicVolControl").attr("disabled", true)
    } else {
        $("#musicVolControl").removeAttr("disabled")
    }
})

$("#musicVolControl").val(music.volume * 100)

$("#musicVolControl").on('change', () => {
    music.volume = $("#musicVolControl").val() * 0.01
})

addEventListener('load', () => {
    music.play()
})
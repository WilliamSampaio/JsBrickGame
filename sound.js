const music = new Audio()
music.src = 'Tetris-99-Main-Theme.mp3'

music.loop = true
music.volume = .8

function play() {
    music.play()
}

addEventListener('load', play)

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
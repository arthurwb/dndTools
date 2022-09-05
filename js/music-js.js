let content = $("#output");
let input = $("#text-input");
// FORMAT >> ["test", "<a href='test' target='_blank'>music<a>"],
let music = [
    //boss
    ["chanting", "drums", "boss", "music", "<a href='https://youtu.be/hXrtICZyzNo' target='_blank'>music<a>"],
    ["rock", "fast", "organ", "boss", "music", "<a href='https://youtu.be/W0MVoTu48nk' target='_blank'>music<a>"],
    ["twinning", "rock", "upbeat", "boss", "music", "<a href='https://youtu.be/NBIRYjP1NNM' target='_blank'>music<a>"],
    ["quiet", "thougtful", "inspirational", "piano", "boss", "music", "<a href='https://youtu.be/rGhNXmnZXyM' target='_blank'>music<a>"],
    //combat
    ["jazzy", "sonic", "fun", "upbeat", "combat", "music", "<a href='https://youtu.be/qqT1wth_bLA' target='_blank'>music<a>"],
    ["long", "mix", "combat", "music", "<a href='https://youtu.be/440i1RCrtxE' target='_blank'>music<a>"],
    ["8-bit", "intense", "combat", "music", "<a href='https://youtu.be/O_CpMBufj5g ' target='_blank'>music<a>"],
    ["ffvii", "long", "combat", "music", "<a href='https://youtu.be/2o_PBYrUNcY' target='_blank'>music<a>"],
    ["cello", "intense", "background", "combat", "music", "<a href='https://youtu.be/7MldTENh8cU' target='_blank'>music<a>"],
    ["classic", "mix", "long", "combat", "music", "<a href='https://youtu.be/w0sUw735gRw' target='_blank'>music<a>"],
    ["underwater", "mix", "long", "combat", "music", "<a href='https://youtu.be/e9mfzLW7N6o' target='_blank'>music<a>"],
    ["intense", "strings", "combat", "music", "<a href='https://youtu.be/WUeZwz2nOUE' target='_blank'>music<a>"],
    ["upbeat", "fun", "light", "combat", "music", "<a href='https://youtu.be/J4uteSnakM4' target='_blank'>music<a>"],
    ["upbeat", "mysterious", "light", "combat", "music", "<a href='https://youtu.be/weGX0QpSH0s' target='_blank'>music<a>"],
    //dungeon
    ["jazzy", "library", "dungeon", "music", "<a href='https://youtu.be/0LtgELThVqA' target='_blank'>music<a>"],
    ["explore", "background", "dungeon", "ambience", "<a href='https://youtu.be/1gryP9yJm7U' target='_blank'>music<a>"],
    ["fight", "background", "dungeon", "music", "<a href='https://youtu.be/Lxhvesbwz3E' target='_blank'>music<a>"],
    ["uncomfortable", "dungeon", "music", "<a href='https://youtu.be/PVKWVh9pLDw' target='_blank'>music<a>"],
    ["drums", "intense", "background", "dungeon", "music", "<a href='https://youtu.be/CoI9K6a4SbY' target='_blank'>music<a>"],
    ["clangly", "background", "dungeon", "music", "<a href='https://youtu.be/ASx3URQYCrE' target='_blank'>music<a>"],
    ["soft", "underground", "background", "dungeon", "music", "<a href='https://youtu.be/paCHLTTS53o' target='_blank'>music<a>"],
    //epic
    ["triumphent", "trumpet", "epic", "music", "<a href='https://youtu.be/klsAzpdQuQY' target='_blank'>music<a>"],
    ["important", "anime", "final boss", "epic", "music", "<a href='https://youtu.be/PUh5oJczSnU' target='_blank'>music<a>"],
    ["anime", "giorno", "epic", "DONOTUSE", "music", "<a href='https://youtu.be/_hGhTMXwd-k' target='_blank'>music<a>"],
    //outdoors
    ["limsa", "seaside", "upbeat", "heroic", "outdoors", "music", "<a href='https://youtu.be/U7ForHMX-xs' target='_blank'>music<a>"],
    ["forest", "soft", "outdoors", "music", "<a href='https://youtu.be/ys1M-zftP4I' target='_blank'>music<a>"],
    ["upbeat", "joyful", "plains", "outdoors", "music", "<a href='https://youtu.be/U2MZ-67Zwd0' target='_blank'>music<a>"],
    ["dark forest", "suspense", "outdoors", "music", "<a href='https://youtu.be/j7n1OqTTkI4' target='_blank'>music<a>"],
    ["underwater", "quiet", "outdoors", "ambience", "<a href='https://youtu.be/NY3XkLe6oKQ' target='_blank'>music<a>"],
    ["sad", "quiet", "thoughtful", "outdoors", "music", "<a href='https://youtu.be/5wyXJHLTMcE' target='_blank'>music<a>"],
    //town
    ["gridania", "foresty", "upbeat", "town", "music", "<a href='https://youtu.be/VSKNntvdRJk' target='_blank'>music<a>"],
    ["tavern", "long", "rain", "town", "ambience", "music", "<a href='https://youtu.be/_4OfDN6X9oc' target='_blank'>music<a>"],
    ["tavern", "long", "quiet", "town", "ambience", "<a href='https://youtu.be/EULoybB2Nsw' target='_blank'>music<a>"],
    ["festival", "upbeat", "town", "music", "<a href='https://youtu.be/2DWAI2JCB9o' target='_blank'>music<a>"],
    ["castle", "quiet", "town", "ambience", "<a href='https://youtu.be/BwV1azM1Ifw' target='_blank'>music<a>"],
    ["castle", "party", "town", "ambience", "music", "<a href='https://youtu.be/qj0boS-gQTY' target='_blank'>music<a>"],
    ["village", "peaceful", "town", "music", "<a href='https://youtu.be/OMkI5l_VBEk' target='_blank'>music<a>"],
    ["city", "streets", "town", "ambience", "<a href='https://youtu.be/_52K0E_gNY0' target='_blank'>music<a>"],
    ["school", "mysterious", "arcane", "town", "music", "<a href='https://youtu.be/HghKnpHejmQ' target='_blank'>music<a>"],
    ["upbeat", "fun", "busy", "town", "music", "<a href='https://youtu.be/iLG_xNdDDdI' target='_blank'>music<a>"],
    //misc
    ["mysterious", "quiet", "guitar", "arcane", "misc", "music", "<a href='https://youtu.be/bXIWAncFPmo' target='_blank'>music<a>"],
    ["filler", "waiting", "fantasy", "misc", "music", "<a href='https://youtu.be/pgLjYsVP4H0' target='_blank'>music<a>"],
];

function contentFunction(value) {
    content.append("<th>" + value + "</th>");
}

function bigContentFunction() {
    content.empty();
    content.append("<b>OUTPUT</b>")
    for (let i = 0; i < music.length; i++){
        if (input.val() == "") {content.append("<br>"); music[i].forEach(contentFunction);}
        for (let j = 0; j <music[i].length; j++) {
            if (music[i][j] == input.val()) {content.append("<br>"); music[i].forEach(contentFunction);}
        }
    }
}

window.onload = function() {
    $("#submit-input").click(function() {
        bigContentFunction();
    });

    $("#text-input").keypress(function (e) {
        if (e.which == 13) {
            bigContentFunction();
        }
    });
}
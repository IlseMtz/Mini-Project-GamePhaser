//configuraciones basicas del mundo creado
    var config = {
        type: Phaser.AUTO,
        width: 3000, //tamaño del mapa
        height: 1000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    //declaracion de variables globales :O
    var playerUno;
    var cursors;
    var gameOver=false;
    var score=0;
    var elapsedTime = 0;
    var tumbleweeds;
    var vidas=4;
    var nivelActual=1;
    var sky;
    var elapsedTimeAux=0;
    var lifeOne;
    var lifeTwo;
    var lifeThree;
    var varAux=false;
    var elapsedTimeDosAux=0;
    var auxaux=0;
    var cancionUno;
    var personajeUno;
    var personajeDos;
    var jugadorSeleccionado; 
    var auxName;   
    var boost;
    var onAndOf=false;
    var encendido=false;
    var onAndOf2=false;
    var encendido2=false;
    var boost2;
    var boostTimeText; 
    var boost2TimeText;
    var timeLeft=10;
    var timeLeft2=10;
    let audioContext;
    let audioBuffer;
    let isMuted = true;  
    var eatSoundVar;
    var offSoundVar;
    var boostSoundVar;

    let countdownTime1 = 10;
    let countdownTime2=10; 

    

    var game = new Phaser.Game(config);//activacion de las preconfiguraciones papa :O

    //funcion para precargar las imagenes de los archivos :O asi es como se rueda aqui
    function preload (){
        this.load.audio('musicUno','assets/song.mp3');
        this.load.audio('eatSound','assets/eatSound.mp3');
        this.load.audio('boostSound','assets/boostSound.mp3');
        this.load.audio('offSound','assets/offSound.mp3');
        this.load.image('sky', 'assets/background.png');
        this.load.image('bothBackground','assets/menuPlayerGame.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('bitcoin', 'assets/bitcoin.png');
        this.load.image('tumbleweed', 'assets/tumbleweed.png');
        this.load.spritesheet('bombardiloCrocodiloPlayerOne', 'assets/crocodiloBombardilo.png', {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('monkeyPlayerOne', 'assets/monkey-cowboy.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('cactus_1','assets/cactus-1.png');
        this.load.image('jumpPlatform','assets/jumpPlatform.png');
        this.load.image('playerUnoImg','assets/playerUnoImg.png');
        this.load.image('playerDosImg','assets/playerDosImg.png');
        this.load.image('life','assets/lifes.png');
        this.load.image('newSky','assets/backgrounDos.png');
        this.load.image('pause','assets/pause.png');
        this.load.image('play','assets/play.png');
        this.load.image('menu','assets/menu.png');
        this.load.image('boostAux','assets/boost.png');
        this.load.image('boost2Aux','assets/boost2.png');
        this.load.image('mute','assets/mute.png');
        this.load.image('unmute','assets/unmute.png');

    }

    function create(){

        eatSoundVar=this.sound.add('eatSound');
        offSoundVar=this.sound.add('offSound');
        boostSoundVar=this.sound.add('boostSound');
        this.cancionUno=this.sound.add('musicUno',{loop: true});


        //  A simple background for our game
        sky =this.add.image(1760, 255, 'sky');


        botonSong = this.add.text(500, 30, '🔇 mute', { fontSize: '32px', fill: '#fff' }).setInteractive();
        botonSong.setScrollFactor(0);

        // Detectar el evento de clic
        botonSong.on('pointerdown', () => {
            if(isMuted==true){
                this.cancionUno.play();
                botonSong.setText('🔇 mute');
                isMuted=false;
            }else{
                this.cancionUno.pause();
                botonSong.setText('🔊 unmute');
                isMuted=true;
            }
            
        });


        this.add.image(960, 770, 'bothBackground').setScrollFactor(0);//fondo de la pantalla de abajo :O
        //The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(2020, 569, 'ground').setScale(2).refreshBody();


        startTime=0;
        //parte del timer del juego :O
        timerText = this.add.text(65, 660, '0', {  //posicion del timer
            fontFamily: 'Minecraft',  //fuente maicraftiana
            fontSize: '90px',  
            color: '#ffffff', 
            padding: { x: 10, y: 5 } 
        });
        // Para que no se mueva el timer
        timerText.setScrollFactor(0);


        let playerName = getSavedPlayerName();
        auxName = this.add.text(1350, 800,'NULL', { fontSize: '60px', fontFamily: 'Minecraft', color: '#ffffff' });
        auxName.setScrollFactor(0); // Hace que el puntaje no se mueva con la cámara
        auxName.setText(playerName);

        

        // The player and its settings
        const urlParams = new URLSearchParams(window.location.search);
            jugadorSeleccionado=urlParams.get('buttonId');

            if(jugadorSeleccionado==2){
                personajeDos=this.physics.add.sprite(100, 450, 'bombardiloCrocodiloPlayerOne');
                playerUno =personajeDos;
                this.add.image(957, 771, 'playerDosImg').setScrollFactor(0);
            }else{
                personajeUno=this.physics.add.sprite(100, 450, 'monkeyPlayerOne');
                playerUno =personajeUno;
                this.add.image(957, 771, 'playerUnoImg').setScrollFactor(0);
            }
            

        
                
        

        //  Player physics properties. Give the little guy a slight bounce.
        playerUno.setBounce(0.2);
        playerUno.setCollideWorldBounds(true);

        //La camara sigue al jugador
        this.cameras.main.startFollow(playerUno);
        this.cameras.main.setBounds(0, 0, 5000, 1000); // Hacer que la cámara pueda moverse con el mundo

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('monkeyPlayerOne', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'monkeyPlayerOne', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('monkeyPlayerOne', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left2',
            frames: this.anims.generateFrameNumbers('bombardiloCrocodiloPlayerOne', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        

        this.anims.create({
            key: 'turn2',
            frames: [ { key: 'bombardiloCrocodiloPlayerOne', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right2',
            frames: this.anims.generateFrameNumbers('bombardiloCrocodiloPlayerOne', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();



        bitcoins = this.physics.add.group({
            key: 'bitcoin',
            repeat: 29,
            setXY: { x: 12, y: 510, stepX: 100 }
        });

        bitcoins.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        var x = (playerUno.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        tumbleweeds = this.physics.add.group();
        



        cactus_1=this.physics.add.staticGroup();
        cactus_1.create(460,519,'cactus_1');
        cactus_1.create(860,519,'cactus_1');
        cactus_1.create(1260,519,'cactus_1');
        cactus_1.create(2060,519,'cactus_1');
        cactus_1.create(2460,519,'cactus_1');
        


        // Crear grupo de plataformas de salto
        jumpPlatforms = this.physics.add.staticGroup();

        // Agregar algunas plataformas de salto en distintas posiciones
        jumpPlatforms.create(300, 200, 'jumpPlatform');
        jumpPlatforms.create(800, 300, 'jumpPlatform');
        jumpPlatforms.create(1200, 300, 'jumpPlatform');
        jumpPlatforms.create(1600, 450, 'jumpPlatform');
        jumpPlatforms.create(2100, 450, 'jumpPlatform');
        jumpPlatforms.create(2500, 300, 'jumpPlatform');

        // Hacer que el jugador colisione con las plataformas de salto
        this.physics.add.collider(playerUno, jumpPlatforms);




        //  The score
        scoreText = this.add.text(65, 850, '0', { fontSize: '80px', fontFamily: 'Minecraft', color: '#ffffff' });
        scoreText.setScrollFactor(0); // Hace que el puntaje no se mueva con la cámara

        
        nivelActualAux = this.add.text(425, 840,'1', { fontSize: '80px', fontFamily: 'Minecraft', color: '#ffffff' });
        nivelActualAux.setScrollFactor(0); // Hace que el puntaje no se mueva con la cámara
        

        this.physics.add.collider(tumbleweeds, platforms);
        this.physics.add.collider(tumbleweeds, jumpPlatforms);
        this.physics.add.collider(bitcoins, jumpPlatforms);
        this.physics.add.collider(playerUno, platforms);
        this.physics.add.collider(playerUno,cactus_1,hitCactus,null,this);
        this.physics.add.collider(bitcoins, platforms);
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(playerUno, bitcoins, collectBitcoin, null, this);
        this.physics.add.collider(playerUno, tumbleweeds, hitTumbleweed, null, this);



        tumbleweeds.children.iterate(function (child) {
            child.setBounce(1);
            child.setCollideWorldBounds(true);
            child.allowGravity = false;
            child.setVelocity(Phaser.Math.Between(-200, 200), 20);
        });

        lifeOne=this.add.image(300,715,'life');
        lifeTwo=this.add.image(425,715,'life');
        lifeThree=this.add.image(550,715,'life');
        lifeOne.setScrollFactor(0); // Hace que el puntaje no se mueva con la cámara
        lifeTwo.setScrollFactor(0);
        lifeThree.setScrollFactor(0);


        let buttonAux = this.add.sprite(1800, 800, 'play');
        buttonAux.setScrollFactor(0);
        buttonAux.setInteractive();
        buttonAux.on('pointerover', () => {
            buttonAux.setTint(0x44ff44); // Cambia el color cuando el puntero pasa sobre el botón
        });
        buttonAux.on('pointerout', () => {
            buttonAux.clearTint(); // Restaurar el color original cuando el puntero sale
        });
        buttonAux.on('pointerdown', () => {
            this.physics.resume();
            this.anims.resumeAll();
            varAux=false;
        });

        let button = this.add.sprite(1800, 690, 'pause');
        button.setScrollFactor(0);
        button.setInteractive();
        button.on('pointerover', () => {
            button.setTint(0x44ff44); // Cambia el color cuando el puntero pasa sobre el botón
        });
        button.on('pointerout', () => {
            button.clearTint(); // Restaurar el color original cuando el puntero sale
        });
        button.on('pointerdown', () => {
            this.physics.pause();
            this.anims.pauseAll();
            varAux=true;
        });

        let buttonAuxDos = this.add.sprite(1800, 910, 'menu');
        buttonAuxDos.setScrollFactor(0);
        buttonAuxDos.setInteractive();
        buttonAuxDos.on('pointerover', () => {
            buttonAuxDos.setTint(0x44ff44); // Cambia el color cuando el puntero pasa sobre el botón
        });
        buttonAuxDos.on('pointerout', () => {
            buttonAuxDos.clearTint(); // Restaurar el color original cuando el puntero sale
        });
        buttonAuxDos.on('pointerdown', () => {
            window.location.href="index.html";
        });

        boost2TimeText = this.add.text(50, 30, '', { fontSize: '40px', fontFamily: 'Minecraft', color: '#ffffff' });
        boost2TimeText.setScrollFactor(0);
        boostTimeText = this.add.text(1100, 30, '', { fontSize: '40px', fontFamily: 'Minecraft', color: '#ffffff' });
        boostTimeText.setScrollFactor(0);

    }

    //funcion de cuando te golpea un cactus aca feo hay no que feo :(/////////////////////////////////////////////
    function hitCactus(player,cactus_1){
        offSoundVar.play();
        vidas--;
        if(vidas===3){
            lifeThree.destroy();
        }else{
            if(vidas===2){
                lifeTwo.destroy();
            }else{
                if(vidas===1){
                    lifeOne.destroy();
                }
            }
        }

        if (vidas <= 0) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            saveScore();
            
        } else {
            cactus_1.body.enable = false;
            player.setTint(0xff0000);
            this.time.delayedCall(3000, function() {
                cactus_1.body.enable = true;
                player.clearTint();
            }, [], this);
        }
    }
    //Finaliza cuando te pega un cactus aca bien feo :(//////////////////////////////////////////////////////////


    //fisicas de caminar del personaje //////////////////////////////////////
    function update (){
        if (gameOver){
            offSoundVar.play();

            return;
        }

        if (cursors.left.isDown){
            playerUno.setVelocityX(-160);

            if(jugadorSeleccionado==2){
                playerUno.anims.play('left2', true);
            }else{
                playerUno.anims.play('left', true);
            }
            
        }
        else if (cursors.right.isDown){
            playerUno.setVelocityX(160);

            if(jugadorSeleccionado==2){
                playerUno.anims.play('right2', true);
            }else{
                playerUno.anims.play('right', true);
            }
        }
        else{
            playerUno.setVelocityX(0);

            if(jugadorSeleccionado==2){
                playerUno.anims.play('turn2', true);
            }else{
                playerUno.anims.play('turn', true);
            }
        }

        if (cursors.up.isDown && playerUno.body.touching.down){
            playerUno.setVelocityY(-330);
        }
        /////////////////////////////////////////////////////////////////////////////////////7////////////////////////////////////////////////////////////////////////////

        
        if(varAux===false){
            // Calculamos el tiempo transcurrido en segundos
            elapsedTime = Math.floor(((this.time.now - startTime) / 1000)-auxaux);
            // Actualizamos el texto con el tiempo
            timerText.setText(elapsedTime);
            if(elapsedTime>=60){
                this.physics.pause();
                playerUno.setTint(0xff0000);
                playerUno.anims.play('turn');
                saveScore();
            
            }
            
            if(elapsedTime==Phaser.Math.Between(5, 45) && onAndOf==false){
                timeLeft = Math.floor(this.time.now / 1000); 
                let x = Phaser.Math.Between(0, 3000);
                let y = 16;

                boost = this.physics.add.sprite(x, y, 'boostAux'); 
                this.physics.add.overlap(playerUno, boost, collectBoost, null, this); 

                this.physics.add.collider(boost, jumpPlatforms);
                this.physics.add.collider(boost, platforms);

                this.time.delayedCall(15000, function() {
                    boost.destroy();
                    onAndOf=false;
                }, [], this);
                onAndOf=true;

            }

            if(elapsedTime==Phaser.Math.Between(5, 45) && onAndOf2==false){
                timeLeft2 = Math.floor(this.time.now / 1000);
                let x = Phaser.Math.Between(0, 3000);
                let y = 16;

                boost2 = this.physics.add.sprite(x, y, 'boost2Aux'); 
                this.physics.add.overlap(playerUno, boost2, collectBoost2, null, this); 

                this.physics.add.collider(boost2, jumpPlatforms);
                this.physics.add.collider(boost2, platforms);

                this.time.delayedCall(15000, function() {
                    boost2.destroy();
                    onAndOf2=false;
                }, [], this);
                onAndOf2=true;

            }

        }else{
            auxaux = auxaux+0.016;
            
        }
    }
    //finalizacion de funciones de caminar del personaje



    //funcion para recojer las monedas
    function collectBitcoin (playerUno, bitcoin){
        bitcoin.disableBody(true, true);
        if(encendido2==true){
            score+=100;
            eatSoundVar.play();
        }
        if (encendido==true) {
            score += 50;
            eatSoundVar.play();
        } else {
            score += 10;
            eatSoundVar.play();
        }
        scoreText.setText(score);

        if (bitcoins.countActive(true) === 0){
            //  A new batch of stars to collect
            nivelActual++;
            nivelActualAux.setText(nivelActual);
            if(nivelActual===2){
                sky.setTexture('newSky');
                onAndOf=false;
            }
            if(nivelActual>=3){
                window.location.href = "ganaste.html";
            }


            bitcoins.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);
            });
            startTime = this.time.now;
            elapsedTime=0;

            var x1 = (playerUno.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var x2 = (playerUno.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var x3 = (playerUno.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            for (let i = 0; i < 3; i++) {
                let x = [x1, x2, x3][i];  // Selecciona uno de los valores x al azar
                var tumbleweed = tumbleweeds.create(x, 16, 'tumbleweed');
                tumbleweed.setBounce(1);
                tumbleweed.setCollideWorldBounds(true);
                tumbleweed.setVelocity(Phaser.Math.Between(-200, 200), 20);
                tumbleweed.allowGravity = false;
            }
        }
    }

    function hitTumbleweed (player, tumbleweed) {
        offSoundVar.play();
        vidas--;
        if(vidas===3){
            lifeThree.destroy();
        }else{
            if(vidas===2){
                lifeTwo.destroy();
            }else{
                if(vidas===1){
                    lifeOne.destroy();
                }
            }
        }

        if (vidas <= 0) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            saveScore();
        } else {
            player.setTint(0xff0000);
            tumbleweed.body.enable=false;
            this.time.delayedCall(3000, function() {
                tumbleweed.body.enable=true;
                player.clearTint();
            }, [], this);
        }
    }
    
    function getSavedPlayerName() {
        let players = JSON.parse(localStorage.getItem("players")) || [];
        if (players.length > 0) {
            return players[players.length - 1].name; // Devuelve el último nombre guardado
        }
        return null; // Si no hay jugadores guardados
    }
    
    function saveScore() {
        let nombreJugador = getSavedPlayerName();
        let scoreData = {
            name: nombreJugador,
            score: score,
            date: new Date().toISOString() // Guarda la fecha en formato ISO
        };
    
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push(scoreData);
        localStorage.setItem("scores", JSON.stringify(scores)); // Guarda en localStorage
    
        gameOver = true;
        window.location.href = "perdiste.html";
    }
    
    function collectBoost(player, boost) {
        boostSoundVar.play();
        // Destruir el boost cuando el jugador lo recoja
        boost.disableBody(true, true);
        encendido=true;
        let startTime = this.time.now;
        this.time.delayedCall(10000, function() {
            encendido=false;
            boostTimeText.destroy();
            console.log("Tiempo transcurrido:", (this.time.now - startTime) / 1000, "segundos");
            countdownTime1=10;
        }, [], this);

        let countdownInterval1 = this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: function() {
                timeLeft=countdownTime1; // Muestra el tiempo restante
                boostTimeText.setText('Tiempo del boost: '+ timeLeft );
                countdownTime1--; // Resta 1 segundo
                if (countdownTime1 <= 0) {
                    countdownInterval1.remove(); // Detiene el contador
                }
            },
            loop: true // Repite cada segundo
        });

    }
    
    function collectBoost2(player, boost2) {
        boostSoundVar.play();
        // Destruir el boost2 cuando el jugador lo recoja
        boost2.disableBody(true, true);
        encendido2=true;
        this.time.delayedCall(10000, function() {
            encendido2=false;
            boost2TimeText.destroy();
            countdownTime2=10;
        }, [], this);


        let countdownInterval2 = this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: function() {
                timeLeft2=countdownTime2; // Muestra el tiempo restante
                boost2TimeText.setText('Tiempo del boost: ' + timeLeft2 );
                countdownTime2--; // Resta 1 segundo
                if (countdownTime2 <= 0) {
                    countdownInterval2.remove(); // Detiene el contador
                }
            },
            loop: true // Repite cada segundo
        });

    }

    
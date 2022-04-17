import socketio

sio = socketio.Client()


class KickError:
    pass


class BanError:
    pass


class Commands:
    def __init__(self):
        pass

    def on_bot_join(self):
        pass

    def on_user_join(self, data):
        pass

    def on_user_leave(self, data):
        pass

    def on_message(self, data):
        pass

def emit(msg):
	global sio
	sio.emit('chat message', {'message': msg})

commands = Commands()  # commands class, will be changed by user
username = 'BOT'  # username, will be changed by user
room = 'https://replchat.vapwastaken.repl.co'


def setup(bot_commands, bot_username, join_room=None):
	global commands
	global username
	global room
	commands = bot_commands
	username = bot_username
	if join_room != None: room += '/?room=' + join_room
	


@sio.event()
def connect():
    commands.on_bot_join(commands)


@sio.on('chat message')
def chat_message(data):
    commands.on_message(commands, data)


@sio.on('joined')
def joined(data):
    commands.on_user_join(commands, data)


@sio.on('left')
def left(data):
    commands.on_user_leave(commands, data)


@sio.on('admin.kick')
def admin_kick(data):
    raise KickError('This bot has been kicked from replchat.')
    sio.disconnect()


@sio.on('banned')
def banned(data):
    raise BanError(
        'This bot has been banned from replchat. It is not recommended to rejoin with another username.'
    )
    sio.disconnect()


@sio.event()
def debug(code):
    if code == "REQUIRES_IDENTIFY":
        sio.emit('identify', username + ' [BOT]')

def run():
	global room
	sio.connect(room,
	            headers={"X-Replit-User-Name": username})
	sio.wait()



__author__ = 'winkEmoji'

from bottle import route, run, static_file, get, Bottle
from bottle_websocket import websocket
from bottle_websocket import GeventWebSocketServer
import time
import json
import random


class StaticVal:
    COUNT = 0
    isOpen = True
    eachGroup = 0
    res = []
    manager_account = '1321807986@qq.com'


staticVal = StaticVal()

''' 访问当前页面用户集合 '''
users = set()
''' 参与匹配用户集合 '''
pairUsers = set()


@get('/')
def getUsers():
    print(str(set2Json(pairUsers)))
    return set2Json(pairUsers)


@get('/api/users', apply=[websocket])
def alterUsers(ws):
    msg = ws.receive()
    args = str(msg).split(':')
    print(args)
    if len(args) >= 2 and args[0] == 'addUsr' and args[1] not in pairUsers and args[1] != '':
        pairUsers.add(args[1])
        staticVal.COUNT += 1

    if len(args) >= 2 and args[0] == 'deleteUsr' and args[1] in pairUsers and args[1] != '':
        pairUsers.remove(args[1])
        staticVal.COUNT -= 1

    if len(args) >= 2 and args[0] == 'status':
        staticVal.isOpen = bool(int(args[1]))

    if len(args) >= 2 and args[0] == 'distribution':
        staticVal.eachGroup = float(args[1])
        distributionGroup()

    if len(args) >= 2 and args[0] == 'reset':
        pairUsers.clear()
        staticVal.COUNT = 0
        staticVal.res = []


@get("/api/people", apply=[websocket])
def callback(ws):
    users.add(ws)
    while True:
        # 向当前页面所有用户广播
        for u in users:
            u.send('queueNum:{}'.format(str(staticVal.COUNT)))
            u.send('pairPeople:{}'.format(set2Json(pairUsers)))
            u.send('isOpen:{}'.format(int(staticVal.isOpen)))
            u.send('manager_account:{}'.format(staticVal.manager_account))
            u.send('res:{}'.format(json.dumps(staticVal.res)))

        msg = ws.receive()
        # 如果接收添加用户消息，增加用户，然后广播
        args = str(msg).split(':')
        print(args)
        if len(args) >= 2 and args[0] == 'add' and args[1] in pairUsers:
            ws.send('isQueueUp:{}'.format('0'))
            ws.send('isOpen:{}'.format(int(staticVal.isOpen)))

        if len(args) >= 2 and args[0] == 'add' and args[1] not in pairUsers and args[1] != '' and staticVal.isOpen is True:
            staticVal.COUNT += 1  # 增加用户
            pairUsers.add(args[1])
            for u in users:
                u.send('queueNum:{}'.format(str(staticVal.COUNT)))
                u.send('pairPeople:{}'.format(set2Json(pairUsers)))


            print('LOG  :pair users count ' + str(staticVal.COUNT))
        else:
            break
    # 判断断开用户是否为匹配用户同时更新匹配人数
    # if ws in pairUsers:
    #    pairUsers.remove(ws)
    #    num.COUNT -= 1
    # 断开连接
    users.remove(ws)
    for u in users:
        u.send('queueNum:{}'.format(str(staticVal.COUNT)))
        u.send('pairPeople:{}'.format(set2Json(pairUsers)))


def set2Json(set):
    return json.dumps(list(set))


def distributionGroup():
    print('eachGroup:{}'.format(staticVal.eachGroup))
    print('COUNT:{}'.format(staticVal.COUNT))

    mod = int(staticVal.COUNT % staticVal.eachGroup)
    print('i am mod:{}'.format(mod))
    if mod != 0:
        groupNum = staticVal.COUNT//staticVal.eachGroup + 1
    else:
        groupNum = staticVal.COUNT//staticVal.eachGroup

    print('groupNum:{}'.format(groupNum))
    # 打乱列表
    ls = list(pairUsers)
    print('ls: {}'.format(ls))
    random.shuffle(ls)
    print('shuffleLs: {}'.format(ls))
    res = []
    temp = []
    for i in range(0, len(ls)):
        if i is 0 or i % int(staticVal.eachGroup) != 0:
            temp.append(ls[i])
        else:
            res.append(temp)
            temp = []
            temp.append(ls[i])
    res.append(temp)
    staticVal.res = res
    print('pair result:{}'.format(staticVal.res))
        #if iter % staticVal.eachGroup





if __name__ == '__main__':
    run(host='0.0.0.0', port=5001, server=GeventWebSocketServer)

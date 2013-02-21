#!/bin/bash

num=+380637304871 #номер адресата
log=loar.valiev@mail.ru  #Ваш почтовый ящик с которого будут высылаться смс
pas=valiev     #Пароль от ящика
msg="dgsdfg"

python ./send.py -l $log -p $pas -n $num -t "$msg"

exit 0

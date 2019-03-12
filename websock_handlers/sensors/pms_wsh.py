import logging
import pymysql
import datetime
import time


_GOODBYE_MESSAGE = u'Goodbye'


logging.basicConfig(filename='pms_wsh.log',level=logging.DEBUG)

class EnvDataLiving():

    def __init__(self, argv):
        self.datetime = argv[0]
        self.pm1=argv[1] 
        self.pm2_5=argv[2]
        self.pm10=argv[3]
                         
        self.pm1_atm=argv[4]
        self.pm2_5_atm=argv[5]
        self.pm10_atm=argv[6]
                         
        self.count0_1=argv[7] 
        self.count0_3=argv[8]
        self.count1=argv[9]
        self.count2_5=argv[10]
        self.count5=argv[11]
        self.count10=argv[12]
                         
        self.temp=argv[13]
        self.humi=argv[14]


    def __repr__(self):
        return "{}|{}|{}|{}|{}|{}|{}|{}|{}|{}|{}|{}|{}|{}|{}".format(\
                self.datetime.strftime("%Y-%m-%d %H:%M:%S"),\
                self.pm1,      \
                self.pm2_5,    \
                self.pm10,     \
                self.pm1_atm,  \
                self.pm2_5_atm,\
                self.pm10_atm, \
                self.count0_1, \
                self.count0_3, \
                self.count1,   \
                self.count2_5, \
                self.count5,   \
                self.count10,  \
                self.temp,     \
                self.humi)



def web_socket_do_extra_handshake(request):
    # This example handler accepts any request. See origin_check_wsh.py for how
    # to reject access from untrusted scripts based on origin value.
    logging.info("Incoming connection from {}".format(srt(request)))
    pass  # Always accept.


def web_socket_transfer_data(request):
    
    db = pymysql.connect('localhost', 'webpage', 'webpage', 'env_data')
    cursor = db.cursor()
    sql = "SELECT * FROM living \
           ORDER BY datetime DESC \
           LIMIT 5;"
    sample = []

    while True:
        try: 
            cursor.execute(sql)
            result = cursor.fetchall()
            i=0
            for row in result:
                sample.append(EnvDataLiving(row))
                print(sample[i])
                i=i+1           
        except:
            db.close()
            logging.error("unable to fetch data")
            raise

        time.sleep(5)
        # line = request.ws_stream.receive_message()
        # logging.info("Receiving data from {}".format(request))
        # if line is None:
        #     return
        # if isinstance(line, unicode):
        #     request.ws_stream.send_message(line, binary=False)
        #     if line == _GOODBYE_MESSAGE:
        #         return
        # else:
        #     request.ws_stream.send_message(line, binary=True)


def web_socket_passive_closing_handshake(request):
    pass



if __name__ == '__main__':
    web_socket_transfer_data(None)
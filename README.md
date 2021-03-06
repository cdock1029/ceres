CERES  
========  
  
Cloud data collector  
Licensed under the Apache 2.0 license. 

Project Contributors:  
Serge Borysov  
Conor Dockry  
Amasi El-Bakush  
Dave Hewitt  
Aneeth Krishnamoorthy  

Special thanks to Yesgoody, Inc. for supporting this project.  

  
Installation Instructions (tested on a stock Ubuntu 12.04 install):  
Commands beginning with a # need to be run as root (or with sudo).  Commands beginning with a $ should be run as a normal user.  

Edit /etc/rc.local and add the line

    echo 1 > /proc/sys/net/ipv4/tcp_tw_reuse  
    
before the
    
    exit 0  

line.

    # apt-get install python-software-properties  
    # add-apt-repository ppa:chris-lea/node.js  
    # apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10  
    # echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list  
    # apt-get update  
    # apt-get install python python-pip build-essential python-dev nodejs mongodb git ruby-dev cmake  
    $ git clone https://github.com/lloyd/yajl.git  
    $ cd yajl  
    $ ./configure  
    $ make  
    # make install  
    # ln -s /usr/local/lib/libyajl.so.2.0.5 /lib/libyajl.so.2  
    # pip install pymongo  
    # npm install nodemon -g  
    $ cd  
    $ git clone https://github.com/cdock1029/ceres.git  
    $ cd ceres 
    $ npm install 
    $ cd src 
    
IMPORTANT NOTE: before running the next line, which puts the oauth consumer keys and secrets in Mongo, 
BE SURE TO CHANGE the contents of config/oauth-secrets.json to contain only the OAuth secrets you want to be valid. 
DO NOT USE the oauth-secrets.json that came with this package as it is PUBLICALLY AVAILABLE!!!
    
    $ node populate-oauth-secrets.js
    $ nodemon ./index.js  
  
The CERES application should be running (on port 8888 by default).  
  
To change the default port or disable OAuth, edit the configuration file config/nodeServer.json .  
To change the mongodb connection, edit the configuration file config/mongodb.json .  
  
To run some basic tests (put a record in the database, query it, modify it, delete it, and run a metric):  

    $ cd  
    $ cd ceres/test  
    $ node testrunner.js POST localhost 8888 /data collect1.json 1  
    $ node testrunner.js GET localhost 8888 /data query1.json 1  
    $ node testrunner.js PUT localhost 8888 /data update1.json 1  
    $ node testrunner.js DELETE localhost 8888 /data del1.json 1  
    $ node testrunner.js GET localhost 8888 /metrics metrics-min.json 1
      
See the README file in the test directory for more details on running the tests.  
See the api.html file in the doc directory for more details on how to send requests.
  


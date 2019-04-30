#!/usr/bin/env python
# -*- coding: utf-8 -*-

import logging
import sys
# from logging.handlers import TimedRotatingFileHandler, RotatingFileHandler

class Logger(logging.Logger):
    logger_fmt = '[%(levelname)s] %(asctime)s [%(filename)s:%(funcName)s:%(lineno)d]: %(message)s'
    logger_date_fmt = '%Y-%m-%d %H:%M:%S'
    stream_handler_fmt = logger_fmt
    stream_handler_date_fmt = logger_date_fmt
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setLevel(logging.DEBUG)
    stream_handler.setFormatter(logging.Formatter(stream_handler_fmt, stream_handler_date_fmt))

    # rotating_file_handler = RotatingFileHandler(filename='uarmcore', mode='a', maxBytes=1024, backupCount=15)
    # timed_rotaing_file_handler = TimedRotatingFileHandler(filename='uarmcore', when='D', interval=1, backupCount=15)

    logger = logging.Logger(__name__)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(stream_handler)
    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, 'logger'):
            cls.logger = super(Logger, cls).__new__(cls, *args, **kwargs)
        return cls.logger

logger = Logger(__name__)


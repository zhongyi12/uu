import json
import os
from urllib.parse import urlparse, urljoin
from urllib.request import urlopen, Request

url = 'http://update.ufactory.cc/releases/history.json'
response = urlopen(url)
remote_json = json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))
# print(remote_json)
config_path = '/Users/chao/git/private/uarm-studio/updates'
# working_dir = os.path.dirname(config_path)
working_dir = config_path
json_save_path = os.path.join(working_dir, 'history-latest.json')
json.dump(remote_json, open(json_save_path, 'w', encoding='utf8'), indent=2, ensure_ascii=False)
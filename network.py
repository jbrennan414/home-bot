import urllib.request
import json

def make_request():
  url = "https://kxqctgyixgptvqihfhudivnlba0yltsn.lambda-url.us-west-2.on.aws"
  try:
    with urllib.request.urlopen(url) as response:
      status_code = response.getcode()
      return status_code
  except urllib.error.HTTPError as e:
    return e.code

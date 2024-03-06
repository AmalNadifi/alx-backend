#!/usr/bin/env python3
""" The following script is a BaseCaching module """
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    This is the class for caching information in key-value pairs
    Methods:
        put(key, item): stores a key-value pair
        get(key): retrieves the value associated with a key
    """

    def __init__(self):
        """
        This function initializes the class using the parent class
        """
        BaseCaching.__init__(self)

    def put(self, key, item):
        """
        This function stores a key-value pair
        Args:
            Key
            Item
        """
        if key is None or item is None:
            pass
        else:
            self.cache_data[key] = item

    def get(self, key):
        """
        This function returns value linked to key.
        If key is None or doesn't exist, return None
        """
        if key is not None and key in self.cache_data.keys():
            return self.cache_data[key]
        return None

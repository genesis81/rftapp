# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in rtfapp/__init__.py
from rtfapp import __version__ as version

setup(
	name='rtfapp',
	version=version,
	description='App für Balgach 2022',
	author='Marco Müller',
	author_email='marco@ms-mueller.ch',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)

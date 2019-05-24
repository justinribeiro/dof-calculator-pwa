# dof-calculator-pwa
> A tiny no-frills depth of field progressive web app for film cameras.

## Why?

Because this is just one of a series of utility PWA's I've had lying around that I use that might be useful to other folks.

## Dev

Hop into the `src` folder and run the local web server of your choice. No specific tool required.

## Build

I didn't really wrap this with build tooling, but I did crunch it down to 1.7K gzip'ed for fun using closure compiler and http-minifier. The rest is just some fancy Linux CLI jumping and sed (and I almost just used a make file instead ;-).

```
$ yarn install
$ yarn dist
```

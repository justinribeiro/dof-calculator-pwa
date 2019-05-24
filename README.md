# dof-calculator-pwa



## Why?

Because the Combination Meter on my 2005 Prius is on the fritz, and I need a speedometer until I can tear apart and repair the faulty caps. :-)

## Dev

Hop into the `src` folder and run the local web server of your choice. No specific tool required.

## Build

I didn't really wrap this with build tooling, but I did crunch it down to 1.7K gzip'ed for fun using closure compiler and http-minifier. The rest is just some fancy Linux CLI jumping and sed (and I almost just used a make file instead ;-).

```
$ yarn install
$ yarn dist
```

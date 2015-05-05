---
layout: ref
title: log
tags: math
---
Calculate the natural logarithm.

    grob.log(10);

Because the logarithm drastically reduces the magnitude of numbers it can be used in cases where a linear scale doesn't work, for example differences in population per country.

Here are the population sizes of Belgium and China, in millions. Applying the log function drastically reduce the differences:

    [grob.log(11.14), grob.log(1351)]

Theoretically, a negative log is infinitely large, producing unusable numbers. We've changed this behaviour so that negative inputs return negative outputs:

    grob.log(-10);

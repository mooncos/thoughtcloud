# quartz-typst

- [X] Equations
$$
f(x) = exp(x)
\
mat(1,2;3,4)
\
$$
- [X] Package Imports
$$
#import "@preview/fletcher:0.5.1": diagram, node, edge
#diagram(spacing:(16mm,16mm),$
    X 
        #edge("r",$f$,"->",bend:30deg)
        #edge("r",$g$,"->",bend:-30deg)
    & Y
$)
$$

$$
#import "@preview/physica:0.9.3": *
tensor(Gamma,+lambda,-mu,-nu)
$$
- [ ] Inline math


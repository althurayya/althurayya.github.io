from math import sqrt

# Determines whether two circles collide and, if applicable,
# the points at which their borders intersect.
# Based on an algorithm described by Paul Bourke:
# http://local.wasp.uwa.edu.au/~pbourke/geometry/2circle/
# Arguments:
#   P0 (complex): the centre point of the first circle
#   P1 (complex): the centre point of the second circle
#   r0 (numeric): radius of the first circle
#   r1 (numeric): radius of the second circle
# Returns:
#   False if the circles do not collide
#   True if one circle wholly contains another such that the borders
#       do not overlap, or overlap exactly (e.g. two identical circles)
#   An array of two complex numbers containing the intersection points
#       if the circle's borders intersect.
def IntersectPoints(P0, P1, r0, r1):
    if type(P0) != complex or type(P1) != complex:
        raise TypeError("P0 and P1 must be complex types")
    # d = distance
    d = sqrt((P1.real - P0.real)**2 + (P1.imag - P0.imag)**2)
    # n**2 in Python means "n to the power of 2"
    # note: d = a + b

    if d > (r0 + r1):
        return False
    elif d < abs(r0 - r1):
        return True
    elif d == 0:
        return True
    else:
        a = (r0**2 - r1**2 + d**2) / (2 * d)
        b = d - a
        h = sqrt(r0**2 - a**2)
        P2 = P0 + a * (P1 - P0) / d

        i1x = P2.real + h * (P1.imag - P0.imag) / d
        i1y = P2.imag - h * (P1.real - P0.real) / d
        i2x = P2.real - h * (P1.imag - P0.imag) / d
        i2y = P2.imag + h * (P1.real - P0.real) / d

        i1 = complex(i1x, i1y)
        i2 = complex(i2x, i2y)

        return [i1, i2]

def CompToStr(c):
    return "(" + str(c.real) + ", " + str(c.imag) + ")"

def PairToStr(p):
    return CompToStr(p[0]) + " , " + CompToStr(p[1])

def Test():
    ip = IntersectPoints

    i = ip(complex(0,0), complex(1, 0), 2, 2)
    s = ip(complex(0,0), complex(4, 0), 2, 2)

    print "Intersection:", PairToStr(i)
    print "Wholly inside:", ip(complex(0,0), complex(1, 0), 5, 2)
    print "Single-point edge collision:", PairToStr(s)
    print "No collision:", ip(complex(0,0), complex(5, 0), 2, 2)

Test()

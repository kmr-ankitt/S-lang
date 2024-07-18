/**
print 3+2;
print "ankit " + "kumar";
var a = "global a";
var b = "global b";
var c = "global c";
{
  var a = "outer a";
  var b = "outer b";
  {
    var a = "inner a";
    print a;
    print b;
    print c;
  }
  print a;
  print b;
  print c;
}
print a;
print b;
print c;

print " ";
var a = 0;
var temp;

for (var b = 1; a < 10000; b = temp + b) {
  print a;
  temp = a;
  a = b;
}
print "While loop ";
print " ";
var sans = "cutie";
var i = 1;
while(i <= 5){
    print sans;
    i = i + 1;
}
print " ";

print "For loop";
print " ";

for(var i = 1; i < 5; i=i+1){
    print "ankit" + "i";
}



fun sayHi(first, last) {
  print "Hi, " + first + " " + last + "!";
}

sayHi("Dear", "Reader");

fun fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}

for (var i = 0; i < 20; i = i + 1) {
  print fib(i);
}


fun makeCounter() {
  var i = 0;
  fun count() {
    i = i + 1;
    print i;
  }

  return count;
}

var counter = makeCounter();
counter(); // "1".
counter(); // "2".


var a = "global";
{
  fun showA() {
    print a;
  }

  showA();
  var a = "block";
  showA();
}
**/

class DevonshireCream {
  serveOn() {
    return "Scones";
  }
}

print DevonshireCream; // 

class Bagel {}
var bagel = Bagel();
print bagel; // Prints "Bagel instance".
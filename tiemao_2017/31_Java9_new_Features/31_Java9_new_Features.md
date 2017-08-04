




## Factory Methods for Collections


### Java7 

List<Point> myList = new ArrayList<Point>();


### Java8 自动类型推断

List<Point> myList = new ArrayList<>();
myList.add(new Point(1, 1));
myList.add(new Point(2, 2));
myList.add(new Point(3, 3));
myList.add(new Point(4, 4));
myList = Collections.unmodifiableList(myList);


### Java9 不可变List

List<Point> list =
List.of(new Point(1, 1), new Point(2, 2),
new Point(3, 3), new Point(4, 4));

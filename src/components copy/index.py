line1 = input()
m = int(line1.split(" ")[0])
n = int(line1.split(" ")[1])
k = int(line1.split(" ")[2])
arr1 = []
arr2 = []
for i in range(0,m):
    line = input()
    for j in range(0,n):
        if(line[j] == "X"):
            arr1.append(i)
            arr2.append(j)

for i in range(0,k):
    line = input()
    arr1.append(int(line.split(" ")[0])-1)
    arr2.append(int(line.split(" ")[1])-1)
while(m>0):
    for i in range(0,m):
        for j in range(0,n):
            if(i in arr1 and j in arr2):
                c=1
    if(c==0):
        print(m)
        break
    else:
        m = m - 1
        
        
        
        
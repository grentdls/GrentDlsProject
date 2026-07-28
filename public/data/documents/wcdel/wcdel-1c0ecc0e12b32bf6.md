# 狗侠客角色基础动画序列帧制作规则文档

> 角色定位：妖兽大陆主角，中华田园犬侠客  
> 美术方向：可爱 2D 俯视角轻 ARPG，人物比例接近《猫咪斗恶龙》式 Q 版小体型、大头、清晰轮廓  
> 当前目标：先制作 **待机 Idle** 与 **移动 Walk / Move** 两组基础动画  
> 使用场景：Unity 2D 角色动画、角色控制器、地图探索、战斗待机、NPC 对话前站立状态

---

## 1. 角色基础设定

### 1.1 角色名称暂定

```text
狗侠客
```

### 1.2 世界观身份

```text
妖兽大陆中的年轻犬族侠客。
性格开朗、勇敢、讲义气，是玩家进入妖兽大陆后的主角。
```

### 1.3 物种要求

必须明确是：

```text
中华田园犬 / 土狗 / 犬族侠客
```

不能画成：

```text
狐狸
狼
柴犬过强风格
猫
熊
普通人类兽耳
```

### 1.4 外观关键点

```text
毛色：暖黄色 / 橙黄色为主
脸部：奶白色口鼻和脸颊
眼睛：大而圆，棕黑色，有高光
耳朵：直立三角耳
尾巴：蓬松卷尾，但不能像狐狸尾巴过长过尖
体型：大头小身，短四肢，Q 版侠客比例
表情：友善、机灵、勇敢
```

### 1.5 服装关键点

服装方向：

```text
朴素年轻侠客
蓝白配色
布衣感
轻便
适合跑动和冒险
```

服装组成：

```text
白色内衫
朴素蓝色外衫 / 短褂
蓝色腰带
简单护腕
深蓝布鞋 / 绑腿
蓝色围巾 / 飘带
腰间短剑
腰间葫芦
```

禁止：

```text
过多金边
复杂纹样
大面积铠甲
过度华丽仙侠服
太厚重的披风
现代服装
复杂盔甲
```

### 1.6 葫芦要求

腰间葫芦必须是标准葫芦形：

```text
上小下大
中间收腰
顶部有短小瓶口
整体像传统酒葫芦
用绳子挂在腰带上
颜色为自然黄褐色
不能像普通圆水壶
不能像南瓜
不能像皮袋
不能变成两个球随便叠加
```

---

## 2. 序列帧总规格

### 2.1 输出格式

```text
文件格式：PNG
背景：透明背景
颜色模式：RGBA
用途：Unity Sprite Sheet
```

### 2.2 图集尺寸

推荐标准：

```text
整张图集尺寸：2048 x 2048 px
网格：8列 x 8行
单帧尺寸：256 x 256 px
总格子数：64
实际动画帧：56
空白格子：8
```

说明：

```text
Idle 每方向 6 帧，共 24 帧
Walk 每方向 8 帧，共 32 帧
总计 56 帧
Idle 每行剩余 2 格留空
```

### 2.3 单帧角色占比

每个 256 x 256 帧内：

```text
角色整体高度：190~220 px
角色宽度：120~180 px，根据方向不同
头顶留白：12~24 px
脚底留白：14~24 px
左右留白：20~40 px
```

角色不能：

```text
顶到边框
脚被裁切
剑被裁切
围巾被裁切
葫芦被裁切
尾巴被裁切
```

### 2.4 角色对齐规则

每一帧必须保持：

```text
脚底基准线一致
角色中心点一致
角色大小一致
朝向一致
武器和葫芦位置逻辑一致
```

推荐轴心：

```text
Pivot：Bottom Center
Unity Pivot：X=0.5, Y=0.08~0.12
```

脚底落点：

```text
每帧角色脚底中心必须对齐到同一个角色基准点
不能出现角色在格子内上下乱跳
除非是动画设计中的轻微呼吸，且脚底不移动
```

### 2.5 方向数量

第一版只做 4 方向：

```text
Down  正面 / 朝屏幕下方
Left  朝屏幕左方
Right 朝屏幕右方
Up    背面 / 朝屏幕上方
```

暂不做：

```text
左上
右上
左下
右下
```

后续如果需要 8 方向，再追加一套。

---

## 3. 图集行列布局规则

### 3.1 总布局

```text
8列 x 8行
每格 256 x 256
```

### 3.2 行布局

| 行号 | 内容 | 帧数 | 说明 |
|---:|---|---:|---|
| Row 1 | Idle_Down | 6 | 第 7、8 格留空 |
| Row 2 | Idle_Left | 6 | 第 7、8 格留空 |
| Row 3 | Idle_Right | 6 | 第 7、8 格留空 |
| Row 4 | Idle_Up | 6 | 第 7、8 格留空 |
| Row 5 | Walk_Down | 8 | 完整 8 帧 |
| Row 6 | Walk_Left | 8 | 完整 8 帧 |
| Row 7 | Walk_Right | 8 | 完整 8 帧 |
| Row 8 | Walk_Up | 8 | 完整 8 帧 |

### 3.3 帧命名规则

导入 Unity 后建议命名：

```text
DogHero_Idle_Down_01
DogHero_Idle_Down_02
DogHero_Idle_Down_03
DogHero_Idle_Down_04
DogHero_Idle_Down_05
DogHero_Idle_Down_06

DogHero_Idle_Left_01
...

DogHero_Walk_Up_08
```

### 3.4 空白格规则

Idle 行第 7、8 格必须：

```text
完全透明
不放角色
不放阴影
不放标注文字
不放边框
```

---

## 4. 美术一致性规则

### 4.1 模型一致性

所有帧必须保持：

```text
头部大小一致
耳朵形状一致
脸部花纹一致
眼睛位置一致
毛色一致
服装颜色一致
剑的位置逻辑一致
葫芦的位置逻辑一致
尾巴大小一致
```

不允许出现：

```text
某帧变狐狸
某帧耳朵变长
某帧葫芦消失
某帧剑左右乱换
某帧衣服突然多花纹
某帧角色高度变化太大
某帧脸型变化明显
```

### 4.2 线条和渲染

风格要求：

```text
清晰外轮廓
简单干净的 2D 上色
轻微软阴影
适合小尺寸显示
颜色明亮但不刺眼
```

不建议：

```text
过度厚涂
复杂光影
写实毛发
太多细碎纹理
过亮特效
```

### 4.3 透明背景

背景必须：

```text
完全透明
不能有棋盘格烘焙进图片
不能有白底
不能有地面影子
不能有环境光圈
```

如果需要角色脚底影子，单独做影子资源，不要烘进角色序列帧。

---

## 5. 动画帧率规则

### 5.1 Idle 帧率

```text
Idle：6 帧
播放帧率：6 FPS
循环时长：1 秒
```

播放方式：

```text
01 → 02 → 03 → 04 → 05 → 06 → 01
```

也可以做更柔和循环：

```text
01 → 02 → 03 → 04 → 05 → 06 → 05 → 04 → 03 → 02 → 01
```

但图集只提供 6 张源帧。

### 5.2 Walk 帧率

```text
Walk：8 帧
播放帧率：10~12 FPS
循环时长：约 0.67~0.8 秒
```

推荐 Unity：

```text
Walk FPS = 12
```

播放方式：

```text
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 01
```

### 5.3 速度适配

当玩家移动速度变化时：

```text
正常速度：12 FPS
减速地形：9~10 FPS
加速 Buff：14 FPS
```

角色脚步频率应和移动速度大致匹配。

---

## 6. Idle 动画总体要求

Idle 是待机动画，不是静态站立。  
它需要表现角色有生命感，但不能动作太大。

Idle 动画包含：

```text
轻微呼吸
头部轻微上下
耳朵轻微动
围巾轻微飘
尾巴轻微摆
葫芦轻微晃
剑穗轻微摆
```

Idle 不允许：

```text
脚步大幅移动
角色在格子里位移
武器大幅挥动
表情夸张变化
身体左右跳
```

### 6.1 Idle 通用运动幅度

```text
身体上下：1~3 px
头部上下：1~2 px
耳朵角度：1~3 度
围巾末端：2~6 px
尾巴：2~5 px
葫芦：1~3 px
剑穗：2~4 px
```

---

## 7. Idle_Down 每帧细节

方向：正面，角色面向屏幕下方。  
用途：默认站立、NPC 对话前、菜单外待机。

### Frame 01

```text
基础站姿。
双脚稳定站立。
身体中位。
头部正中。
眼睛睁开。
围巾自然向右后方飘。
尾巴轻轻卷在身体右侧。
葫芦自然垂在腰间。
剑柄和剑穗清楚可见。
```

### Frame 02

```text
身体轻微上抬 1 px。
胸口轻微鼓起，表现吸气。
耳朵略微上扬。
围巾末端上扬 2 px。
尾巴末端轻微上翘。
葫芦向外轻摆 1 px。
```

### Frame 03

```text
身体保持上抬。
头部轻微向右偏 1 px。
眼神保持明亮。
右耳轻微抖动。
剑穗向右轻摆。
围巾继续轻微飘动。
```

### Frame 04

```text
身体回到中位。
头部回正。
眼睛可以做半眨眼，不能完全闭死。
尾巴回到中位。
葫芦轻微回摆。
```

### Frame 05

```text
身体轻微下沉 1 px。
表现呼气。
肩膀略放松。
围巾末端下落。
耳朵回到普通角度。
尾巴轻轻向另一侧摆。
```

### Frame 06

```text
身体回到基础站姿。
眼睛完全睁开。
脸部表情恢复 Frame 01。
围巾、尾巴、葫芦回到接近起始状态。
保证和 Frame 01 能平滑循环。
```

---

## 8. Idle_Left 每帧细节

方向：左侧，角色面向屏幕左方。  
用途：角色面向左时待机。

### Frame 01

```text
标准左侧站姿。
头部侧面轮廓清楚。
鼻子朝左。
单只大眼睛可见。
围巾向后方，即屏幕右侧飘。
尾巴在身后右侧可见。
剑和葫芦挂在腰间，不能遮挡腿部。
```

### Frame 02

```text
身体轻微上抬。
胸口吸气。
耳朵轻微上扬。
围巾末端向右上轻飘。
尾巴上抬 2 px。
葫芦向后轻摆。
```

### Frame 03

```text
头部轻微向前探 1 px，像在观察。
鼻尖位置略向左。
围巾继续飘。
剑穗轻摆。
后脚保持不移动。
```

### Frame 04

```text
身体回中。
眼睛半眨。
耳朵稍微向后压一点。
尾巴回中。
葫芦回摆。
```

### Frame 05

```text
身体轻微下沉。
肩膀放松。
围巾末端下落。
尾巴向下轻摆。
腿部不换步，只保持待机。
```

### Frame 06

```text
恢复标准左侧站姿。
眼睛睁开。
所有飘动物回到接近 Frame 01。
保证循环不跳。
```

---

## 9. Idle_Right 每帧细节

方向：右侧，角色面向屏幕右方。  
理论上可以由 Left 镜像，但因为剑、葫芦、围巾等配件可能有左右逻辑，建议单独检查。

### Frame 01

```text
标准右侧站姿。
鼻子朝右。
单只大眼睛可见。
围巾向身后，即屏幕左侧飘。
尾巴在身后左侧可见。
葫芦和剑位置与角色设定一致。
```

### Frame 02

```text
身体轻微上抬。
耳朵上扬。
围巾末端向左上轻飘。
尾巴轻微上翘。
葫芦轻摆。
```

### Frame 03

```text
头部轻微向前探 1 px。
鼻尖更靠右。
眼睛保持睁开。
剑穗轻摆。
脚底不移动。
```

### Frame 04

```text
身体回中。
眼睛半眨。
耳朵轻压。
围巾从高位回落。
```

### Frame 05

```text
身体下沉。
肩膀放松。
尾巴轻轻下摆。
葫芦回摆。
```

### Frame 06

```text
恢复标准右侧站姿。
和 Frame 01 能顺滑循环。
```

---

## 10. Idle_Up 每帧细节

方向：背面，角色面向屏幕上方。  
用途：角色朝地图上方站立。

### Frame 01

```text
标准背面站姿。
后脑勺和两只耳朵清楚。
蓝色外衫背面清楚。
围巾从脖子向一侧飘出。
尾巴在身体下方偏侧清楚可见。
剑鞘、葫芦从背面能看到轮廓。
```

### Frame 02

```text
身体轻微上抬。
耳朵略微上扬。
围巾末端上飘。
尾巴轻轻上翘。
葫芦轻摆。
```

### Frame 03

```text
头部轻微向一侧偏 1 px。
耳朵角度稍有变化。
背部衣摆轻动。
剑鞘保持稳定。
```

### Frame 04

```text
身体回中。
围巾回落。
尾巴回中。
葫芦回摆。
```

### Frame 05

```text
身体轻微下沉。
肩背放松。
衣摆略微向下。
尾巴向另一侧轻摆。
```

### Frame 06

```text
恢复标准背面站姿。
所有配件回到接近 Frame 01。
保证循环不跳。
```

---

## 11. Walk 动画总体要求

Walk 是移动循环动画，要有清楚步伐。  
因为角色是 Q 版，动作可以夸张一点，但不能跳跃太大。

Walk 动画包含：

```text
左右脚交替
身体轻微上下起伏
头部轻微跟随
手臂前后摆动
围巾滞后摆动
尾巴随步伐摆动
剑鞘、葫芦、剑穗跟随身体晃动
```

### 11.1 Walk 通用运动幅度

```text
身体上下：2~5 px
头部上下：1~3 px
脚步前后：6~12 px
手臂摆动：4~10 px
围巾末端：6~14 px
尾巴：5~12 px
葫芦摆动：2~6 px
剑穗摆动：4~8 px
```

### 11.2 Walk 循环节奏

8 帧步态建议：

```text
01  左脚前 / 右脚后
02  过渡
03  身体最高点
04  双脚接近中位
05  右脚前 / 左脚后
06  过渡
07  身体最高点
08  双脚接近中位
```

Frame 01 和 Frame 05 是两次相反步态。  
Frame 04 和 Frame 08 是过渡帧。

---

## 12. Walk_Down 每帧细节

方向：正面向下走。  
玩家在地图上向屏幕下方移动时播放。

### Frame 01

```text
左脚向前迈出，右脚在后。
身体略微向左倾。
左手略后，右手略前。
头部中位。
围巾向右后方飘。
尾巴向右轻摆。
葫芦向角色左侧轻晃。
```

### Frame 02

```text
左脚落地。
身体向前下压 1~2 px。
右脚开始抬起。
手臂摆动接近中位。
围巾滞后，保持向右。
葫芦向外摆动最大。
```

### Frame 03

```text
身体上抬到最高点。
右脚离地准备前迈。
头部上抬 1 px。
耳朵略上扬。
尾巴轻上翘。
剑穗向一侧摆。
```

### Frame 04

```text
双脚接近中位。
身体回到中线。
手臂交替过中。
围巾开始向反方向轻摆。
葫芦回到中位。
```

### Frame 05

```text
右脚向前迈出，左脚在后。
身体略微向右倾。
右手略后，左手略前。
头部保持正面。
尾巴向左轻摆。
葫芦向另一侧晃。
```

### Frame 06

```text
右脚落地。
身体下压。
左脚开始抬起。
围巾跟随身体方向滞后摆动。
剑鞘轻晃。
```

### Frame 07

```text
身体再次上抬到最高点。
左脚离地准备下一步。
耳朵轻动。
尾巴上翘。
葫芦摆动到另一侧最大。
```

### Frame 08

```text
双脚回中位。
身体回中。
手臂回过渡状态。
围巾、尾巴、葫芦接近 Frame 01 的准备状态。
保证循环到 Frame 01 不跳。
```

---

## 13. Walk_Left 每帧细节

方向：向左走。  
侧面步态必须读得清楚。

### Frame 01

```text
靠近镜头的脚向前，远侧脚在后。
身体略向左前倾。
鼻子朝左。
前手略后摆，后手略前摆。
围巾向右飘。
尾巴向右后方摆。
葫芦挂在腰间，略向后晃。
```

### Frame 02

```text
前脚落地。
身体下压 1~2 px。
后脚开始抬起。
头部略向前。
围巾保持滞后。
剑鞘轻微上扬。
```

### Frame 03

```text
身体上抬。
后脚向前摆。
耳朵轻弹。
尾巴上翘。
葫芦向后摆到最大。
```

### Frame 04

```text
双脚交错经过中位。
身体回正。
手臂经过中位。
围巾开始回摆。
```

### Frame 05

```text
另一只脚向前。
身体仍朝左，但重心换到另一侧。
头部略低。
尾巴向下再向后摆。
葫芦向前轻晃。
```

### Frame 06

```text
脚落地。
身体下压。
另一脚抬起。
剑穗向前摆。
围巾向右后方拖出。
```

### Frame 07

```text
身体上抬。
脚步准备回到第一步。
尾巴轻上翘。
葫芦摆回。
```

### Frame 08

```text
过渡到 Frame 01。
脚接近中位。
身体恢复左侧标准跑走姿。
围巾、尾巴、葫芦回到循环起点。
```

---

## 14. Walk_Right 每帧细节

方向：向右走。  
可以参考 Walk_Left 的镜像，但要检查道具位置。

### Frame 01

```text
靠近镜头的脚向前，远侧脚在后。
身体略向右前倾。
鼻子朝右。
围巾向左飘。
尾巴向左后方摆。
葫芦略向后晃。
```

### Frame 02

```text
前脚落地。
身体下压。
后脚抬起。
头部略向前。
围巾保持滞后。
剑鞘轻晃。
```

### Frame 03

```text
身体上抬。
后脚向前摆。
耳朵轻弹。
尾巴上翘。
葫芦向后摆到最大。
```

### Frame 04

```text
双脚经过中位。
身体回正。
手臂经过中位。
围巾开始回摆。
```

### Frame 05

```text
另一只脚向前。
身体重心切换。
尾巴向下再向后摆。
葫芦向前轻晃。
```

### Frame 06

```text
脚落地。
身体下压。
另一脚抬起。
剑穗向前摆。
围巾向左后方拖出。
```

### Frame 07

```text
身体上抬。
脚步准备循环。
尾巴轻上翘。
葫芦摆回。
```

### Frame 08

```text
过渡回 Frame 01。
身体恢复右侧标准走姿。
围巾、尾巴、葫芦接近起点。
```

---

## 15. Walk_Up 每帧细节

方向：背面向上走。  
这是最容易做丢细节的方向，必须保证背面识别清楚。

### Frame 01

```text
左脚向前，也就是屏幕上方迈出。
背部蓝色外衫清楚。
后脑勺和耳朵稳定。
围巾向一侧拖后。
尾巴从身体下方偏右摆出。
剑鞘和葫芦从背面可见。
```

### Frame 02

```text
左脚落地。
身体下压。
右脚开始抬起。
背部衣摆轻轻下沉。
葫芦向一侧摆。
```

### Frame 03

```text
身体上抬。
右脚向前摆。
耳朵轻上弹。
围巾末端上扬。
尾巴上翘。
```

### Frame 04

```text
双脚接近中位。
身体回中。
衣摆和围巾开始反向摆。
葫芦回中。
```

### Frame 05

```text
右脚向前。
身体重心换侧。
尾巴向另一侧摆。
剑鞘轻晃。
```

### Frame 06

```text
右脚落地。
身体下压。
左脚抬起。
围巾滞后拖动。
葫芦向另一侧摆到较大幅度。
```

### Frame 07

```text
身体上抬。
左脚准备迈回第一步。
耳朵轻弹。
尾巴上翘。
衣摆轻扬。
```

### Frame 08

```text
回到过渡中位。
背面轮廓稳定。
围巾、尾巴、葫芦接近 Frame 01 的循环状态。
```

---

## 16. 各部件动画规则

### 16.1 头部

```text
Idle：轻微上下呼吸
Walk：跟随身体上下
不能左右漂移过大
不能导致脸型变化
```

### 16.2 耳朵

```text
Idle：偶尔轻微弹动
Walk：跟随步伐有轻弹
Up 方向：耳朵背面仍要清楚
```

### 16.3 眼睛

```text
Idle 正面可以加入半眨眼
Walk 不建议频繁眨眼
侧面只显示一只主眼即可
背面不显示眼睛
```

### 16.4 围巾

```text
围巾是动感重点
Idle：轻微飘
Walk：明显滞后身体运动
方向逻辑必须正确
角色向左走，围巾主要向右后方拖
角色向右走，围巾主要向左后方拖
角色向上走，围巾左右轻摆
角色向下走，围巾向后侧飘
```

### 16.5 尾巴

```text
尾巴必须像狗尾巴
蓬松但不能太长
Idle：小幅摆动
Walk：随步伐左右摆
Up 方向尾巴最明显
```

### 16.6 剑

```text
剑保持在腰间
走路时轻微晃动
不能每帧位置乱跳
不能突然消失
不能变成长刀
```

### 16.7 葫芦

```text
葫芦挂在腰带一侧
必须双葫芦轮廓，上小下大
Idle：轻微摆
Walk：跟随步伐左右晃
不要变成圆袋子
不要贴死在身体上
不要和手混在一起
```

### 16.8 衣摆

```text
Idle：轻微起伏
Walk：跟随腿部运动有小幅摆动
衣服保持朴素，不增加复杂纹样
```

---

## 17. Unity 导入规则

### 17.1 Sprite Import 设置

```text
Texture Type：Sprite (2D and UI)
Sprite Mode：Multiple
Pixels Per Unit：100，或按项目统一值
Mesh Type：Full Rect
Extrude Edges：1
Filter Mode：Bilinear 或 Point，按美术风格决定
Compression：None 或 High Quality
Alpha Is Transparency：开启
```

如果是高清手绘风：

```text
Filter Mode：Bilinear
Compression：None
```

如果想要像素风：

```text
Filter Mode：Point
```

本项目不是像素风，推荐 Bilinear。

### 17.2 Sprite Editor 切片

```text
Grid By Cell Size
Cell Size：256 x 256
Offset：0, 0
Padding：0, 0
Pivot：Bottom Center
```

### 17.3 Animator Clip

需要创建 8 个动画 Clip：

```text
DogHero_Idle_Down
DogHero_Idle_Left
DogHero_Idle_Right
DogHero_Idle_Up
DogHero_Walk_Down
DogHero_Walk_Left
DogHero_Walk_Right
DogHero_Walk_Up
```

### 17.4 Animator 参数

```text
MoveX：float
MoveY：float
Speed：float
LastDirX：float
LastDirY：float
State：int 或 enum
```

基本切换规则：

```text
Speed <= 0.1 → Idle
Speed > 0.1 → Walk
根据 LastDirection 选择 Down / Left / Right / Up
```

### 17.5 动画循环

所有 Idle / Walk：

```text
Loop Time：开启
Loop Pose：开启
```

---

## 18. 图集验收标准

### 18.1 技术验收

```text
PNG 透明背景
整图 2048 x 2048
8 x 8 网格
单帧 256 x 256
总计 56 个有效角色帧
Idle 行第 7、8 格为空
所有帧完整不裁切
角色脚底基准线一致
```

### 18.2 美术验收

```text
看起来是中华田园犬，不是狐狸
服装朴素，蓝白侠客风
葫芦形状正确
剑清楚可读
围巾清楚可读
4 个方向都能识别角色身份
角色比例统一
没有突然变脸
没有多余背景
```

### 18.3 动画验收

```text
Idle 有呼吸感
Walk 有清楚步伐
围巾有跟随
尾巴有摆动
葫芦和剑自然晃动
循环播放不跳帧
方向切换不突兀
```

### 18.4 游戏内验收

```text
角色在 Unity 中切片正确
播放 Idle 不抖位置
播放 Walk 不滑脚过重
移动方向和动画方向一致
角色大小适合地图
血条和影子能正确挂点
```

---

## 19. 第一版生成要求总结

第一版只生成以下内容：

```text
Idle_Down 6 帧
Idle_Left 6 帧
Idle_Right 6 帧
Idle_Up 6 帧
Walk_Down 8 帧
Walk_Left 8 帧
Walk_Right 8 帧
Walk_Up 8 帧
```

不生成：

```text
攻击
翻滚
施法
受击
死亡
特效
阴影
UI
武器挥砍光
```

后续第二版再做：

```text
Attack 四方向 6~8 帧
Roll 四方向 6~8 帧
Cast 四方向 8 帧
Hit 四方向 3~4 帧
Dead 8 帧
```

---

## 20. 给 AI 生成图集的提示词模板

```text
Create a production-ready 2D game sprite sheet for a cute anthropomorphic Chinese rural dog wuxia hero. The character is a dog swordsman inspired by a Chinese rural dog, not a fox or wolf. Warm yellow-orange fur, cream muzzle and cheeks, upright triangular dog ears, curled fluffy dog tail, big expressive brown eyes. He wears a plain blue-and-white young wandering swordsman outfit: simple white inner robe, modest blue short outer robe, blue sash, cloth bracers, soft boots, blue scarf. A short sword is at his waist and a correctly shaped traditional Chinese bottle gourd hangs from the belt, with a small top bulb and larger bottom bulb.

Sprite sheet rules: transparent PNG, no background, 2048x2048, 8 columns x 8 rows, each frame 256x256. Four directions only: Down, Left, Right, Up. Row 1 Idle Down 6 frames, last 2 cells empty. Row 2 Idle Left 6 frames, last 2 cells empty. Row 3 Idle Right 6 frames, last 2 cells empty. Row 4 Idle Up 6 frames, last 2 cells empty. Row 5 Walk Down 8 frames. Row 6 Walk Left 8 frames. Row 7 Walk Right 8 frames. Row 8 Walk Up 8 frames. Keep character scale and feet alignment consistent. Whole body visible in every frame. Character occupies 75-85% of frame height. Clean 2D hand-painted cartoon game style, crisp outline, simple shading, chibi proportions, Cat Quest-like readable top-down action RPG proportions. Idle frames show subtle breathing, ear motion, scarf sway, tail and gourd movement. Walk frames show clear alternating steps, arm swing, cloth and scarf follow-through, tail motion, sword and gourd natural swing. No text, no labels, no UI, no shadows, no effects, no scene background.
```

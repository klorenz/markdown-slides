# Markdown Slides

Markdown Slides lets you manage a set of slides and show it.


## Install

Install markdown-slides globally with **npm**

```bash
$ npm install -g markdown-slides
```


## Showing Slides

You can show your slides running

```bash
$ markdown-slides show
```

## Customizing

You can customzie your slides ...

Themes ...


## First Slides


```markdown
# Markdown Slides

Markdown Slides lets you manage a set of slides and show it.
```

... created the first slide


## Graphics Support

Markdown Slides supports following graphics:

- GraphViz
- GNU PIC
- Mermaid
- PlantUML

### GraphViz Directed Graph

```
\\<digraph>
rankdir=LR
A -> B
B -> C
C -> D
D -> B
\\</digraph>
```

<digraph>
rankdir=LR
A -> B
B -> C
C -> D
D -> B
</digraph>

### GraphViz Graph

```
\\<graph>
rankdir=LR
A -- B
B -- C
C -- D
D -- B
\\</graph>
```

<graph>
rankdir=LR
A -- B
B -- C
C -- D
D -- B
</graph>

### GNU Pic

```
\\<pic>
box "Hello World" ; arrow ; circle
\\</pic>
```

<pic>
box "Hello World" ; arrow ; circle
</pic>

### Mermaid

```
\\<mermaid>
graph TD
  A --> B
\\</mermaid>
```


<mermaid>
graph TD
  A --> B
</mermaid>

### Plantuml

```
\\<puml>
  Alice -> Bob : Hello
\\</puml>
```
<puml>
  Alice -> Bob : Hello
</puml>



// Copyright (c) 2019 Bottersnike
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the The GNU Affero General Public
// License as published by the Free Software Foundation; either
// version 3 of the License, or (at your option) any later version.
//
// You should have received a copy of the GNU Affero General Public
// License along with this library; if not, write to the Free Software
// Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA

/*
   global

   last, _, ValueBlock, FlowClampBlock, FlowBlock, MusicBlocks, Mouse,
   NOINPUTERRORMSG, NANERRORMSG, toFixed2, _THIS_IS_MUSIC_BLOCKS_
 */

/*
   Global locations
   - js/utils/utils.js
        _
   - js/protoblocks.js 
    ValueBlock, FlowClampBlock
   - js/js-export/export.js
    MusicBlocks, Mouse
   - js/logo.js
    NOINPUTERRORMSG, NANERRORMSG
   - js/utils/utils.js
   toFixed2
 */

/* exported setupGraphicsBlocks */

function setupGraphicsBlocks(activity) {
    class HeadingBlock extends ValueBlock {
        constructor() {
            //.TRANS: orientation or compass direction
            super("heading", _("heading"));
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.parameter = true;
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Heading block returns the orientation of the mouse."),
                    "documentation",
                    ""
                ]);
            } else {
                this.setHelpString([
                    _("The Heading block returns the orientation of the turtle."),
                    "documentation",
                    ""
                ]);
            }
        }

        setter(logo, value, turtle) {
            const turtleObj = activity.turtles.turtleList[activity.turtles.companionTurtle(turtle)];
            turtleObj.painter.doSetHeading(value);
        }

        updateParameter(logo, turtle) {
            return toFixed2(
                activity.turtles.turtleList[activity.turtles.companionTurtle(turtle)].orientation
            );
        }

        arg(logo, turtle, blk) {
            if (
                logo.inStatusMatrix &&
                activity.blocks.blockList[activity.blocks.blockList[blk].connections[0]].name === "print"
            ) {
                logo.statusFields.push([blk, "heading"]);
            } else {
                return activity.turtles.turtleList[
                    activity.turtles.companionTurtle(turtle)
                ].orientation;
            }
        }
    }

    class YBlock extends ValueBlock {
        constructor() {
            //.TRANS: y coordinate
            super("y");
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.parameter = true;
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Y block returns the vertical position of the mouse."),
                    "documentation",
                    null,
                    "xyhelp"
                ]);
            } else {
                this.setHelpString([
                    _("The Y block returns the vertical position of the turtle."),
                    "documentation",
                    null,
                    "xyhelp"
                ]);
            }

            this.formBlock({
                name: this.lang === "ja" ? _("y3") : _("y")
            });
        }

        setter(logo, value, turtle) {
            const turtleObj = activity.turtles.turtleList[activity.turtles.companionTurtle(turtle)];
            turtleObj.painter.doSetXY(turtleObj.x, value);
        }

        updateParameter(logo, turtle) {
            return toFixed2(activity.turtles.turtleList[
                activity.turtles.companionTurtle(turtle)
            ].y);
        }

        arg(logo, turtle, blk) {
            if (
                logo.inStatusMatrix &&
                activity.blocks.blockList[activity.blocks.blockList[blk].connections[0]].name === "print"
            ) {
                logo.statusFields.push([blk, "y"]);
            } else {
                return activity.turtles.screenY2turtleY(
                    activity.turtles.turtleList[
                        activity.turtles.companionTurtle(turtle)
                    ].container.y
                );
            }
        }
    }

    class XBlock extends ValueBlock {
        constructor() {
            //.TRANS: x coordinate
            super("x");
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.parameter = true;
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The X block returns the horizontal position of the mouse."),
                    "documentation",
                    null,
                    "xyhelp"
                ]);
            } else {
                this.setHelpString([
                    _("The X block returns the horizontal position of the turtle."),
                    "documentation",
                    null,
                    "xyhelp"
                ]);
            }

            this.formBlock({
                name: this.lang === "ja" ? _("x3") : _("x")
            });
        }

        setter(logo, value, turtle) {
            const turtleObj = activity.turtles.turtleList[activity.turtles.companionTurtle(turtle)];
            turtleObj.painter.doSetXY(value, turtleObj.y);
        }

        updateParameter(logo, turtle) {
            return toFixed2(activity.turtles.turtleList[
                activity.turtles.companionTurtle(turtle)
            ].x);
        }

        arg(logo, turtle, blk) {
            if (
                logo.inStatusMatrix &&
                activity.blocks.blockList[activity.blocks.blockList[blk].connections[0]].name === "print"
            ) {
                logo.statusFields.push([blk, "x"]);
            } else {
                return activity.turtles.screenX2turtleX(
                    activity.turtles.turtleList[
                        activity.turtles.companionTurtle(turtle)
                    ].container.x
                );
            }
        }
    }

    class ScrollXYBlock extends FlowBlock {
        constructor() {
            //.TRANS: scroll canvas image by x, y position
            super("scrollxy", _("scroll xy"));
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);

            this.setHelpString([
                _("The Scroll XY block moves the canvas."),
                "documentation",
                null,
                "everybeathelp"
            ]);

            this.formBlock({
                args: 2,
                defaults: [100, 0],
                argLabels: this.lang === "ja" ? [_("x2"), _("y2")] : [_("x"), _("y")]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 2) {
                if (typeof args[0] === "string" || typeof args[1] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push([args[0], args[1]]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState =
                              activity.turtles.turtleList[
                                  activity.turtles.companionTurtle(turtle)
                              ].painter.penState;
                        activity.turtles.turtleList[
                            activity.turtles.companionTurtle(turtle)
                        ].painter.penState = false;
                        activity.turtles.turtleList[
                            activity.turtles.companionTurtle(turtle)
                        ].painter.doScrollXY(args[0], args[1]);
                        activity.turtles.turtleList[
                            activity.turtles.companionTurtle(turtle)
                        ].painter.penState = savedPenState;
                    } else {
                        activity.turtles.turtleList[
                            activity.turtles.companionTurtle(turtle)
                        ].painter.doScrollXY(args[0], args[1]);
                    }
                }
            }
        }
    }

    class ClearBlock extends FlowBlock {
        constructor() {
            //.TRANS: erase the screen and return the mice to the center position
            super("clear", _("clear"));
            this.setPalette("graphics", activity);
            this.setHelpString();
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (logo.inMatrix) {
                // ignore clear block in matrix
            } else if (tur.singer.inNoteBlock.length > 0) {
                tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
            } else {
                if (tur.singer.suppressOutput) {
                    const savedPenState = tur.painter.penState;
                    tur.painter.penState = false;
                    tur.painter.doSetXY(0, 0);
                    tur.painter.doSetHeading(0);
                    tur.painter.penState = savedPenState;
                } else {
                    logo.svgBackground = true;
                    tur.painter.doClear(true, true, true);
                }
            }
        }
    }

    class ControlPoint2Block extends FlowBlock {
        constructor() {
            super("controlpoint2");
            this.setPalette("graphics", activity);
            this.setHelpString([
                _("The Control-point 2 block sets the second control point for the Bezier curve."),
                "documentation",
                ""
            ]);

            this.formBlock({
                //.TRANS: control point in a bezier curve
                name: _("control point 2"),
                args: 2,
                defaults: [100, 25],
                argLabels: this.lang === "ja" ? [_("x1"), _("y1")] : [_("x"), _("y")]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 2) {
                if (typeof args[0] === "string" || typeof args[1] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    tur.painter.setControlPoint2(args);
                }
            }
        }
    }

    class ControlPoint1Block extends FlowBlock {
        constructor() {
            super("controlpoint1");
            this.setPalette("graphics", activity);
            this.setHelpString([
                _("The Control-point 1 block sets the first control point for the Bezier curve."),
                "documentation",
                ""
            ]);

            this.formBlock({
                //.TRANS: control point in a bezier curve
                name: _("control point 1"),
                args: 2,
                defaults: [100, 75],
                argLabels: this.lang === "ja" ? [_("x1"), _("y1")] : [_("x"), _("y")]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 2) {
                if (typeof args[0] === "string" || typeof args[1] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    tur.painter.setControlPoint1(args);
                }
            }
        }
    }

    class BezierBlock extends FlowBlock {
        constructor() {
            super("bezier");
            this.setPalette("graphics", activity);
            this.setHelpString([_("The Bezier block draws a Bezier curve."), "documentation", ""]);

            this.formBlock({
                //.TRANS: Bézier curves employ at least three points to define a curve
                name: _("bezier"),
                args: 2,
                defaults: [0, 100],
                argLabels: this.lang === "ja" ? [_("x1"), _("y1")] : [_("x"), _("y")]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 2) {
                if (typeof args[0] === "string" || typeof args[1] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doBezier(args[0], args[1]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doBezier(args[0], args[1]);
                    }
                }
            }
        }
    }

    class ArcBlock extends FlowBlock {
        constructor() {
            super("arc");
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.piemenuValuesC1 = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150,
                165, 180, 195, 210, 225, 240, 255, 270,
                285, 300, 315, 330, 345, 360];
            this.piemenuValuesC2 = [25, 50, 75, 100, 125, 150, 175, 200, 225,
                250, 275, 300];
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Arc block moves the mouse in a arc."),
                    "documentation",
                    null,
                    "archelp"
                ]);
            } else {
                this.setHelpString([
                    _("The Arc block moves the turtle in a arc."),
                    "documentation",
                    null,
                    "archelp"
                ]);
            }

            this.formBlock({
                //.TRANS: draws a part of the circumference of a circle
                name: _("arc"),
                args: 2,
                defaults: [90, 100],
                argLabels: [_("angle"), _("radius")]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 2) {
                if (typeof args[0] === "string" || typeof args[1] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push([args[0], args[1]]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doArc(args[0], args[1]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doArc(args[0], args[1]);
                    }
                }
            }
        }
    }

    class SetHeadingBlock extends FlowBlock {
        constructor() {
            //.TRANS: set compass heading
            super("setheading", _("set heading"));
            this.setPalette("graphics", activity);
            this.beginnerBlock(this.lang !== "ja");
            this.piemenuValuesC1 = [0, 30, 45, 60, 90, 120, 135, 150, 180,
                210, 225, 240, 270, 300, 315, 330];

            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Set heading block sets the heading of the mouse."),
                    "documentation",
                    ""
                ]);
            } else {
                this.setHelpString([
                    _("The Set heading block sets the heading of the turtle."),
                    "documentation",
                    ""
                ]);
            }

            this.formBlock({
                args: 1,
                defaults: [0]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 1) {
                if (typeof args[0] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push(args[0]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    tur.painter.doSetHeading(args[0]);
                }
            }
        }
    }

    class SetXYBlock extends FlowBlock {
        constructor() {
            super("setxy");
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);

            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Set XY block moves the mouse to a specific position on the screen."),
                    "documentation",
                    ""
                ]);
            } else {
                this.setHelpString([
                    _("The Set XY block moves the turtle to a specific position on the screen."),
                    "documentation",
                    ""
                ]);
            }

            this.formBlock({
                //.TRANS: set xy (Cartesian) position
                name: _("set xy"),
                args: 2,
                defaults: [0, 0],
                argLabels: this.lang === "ja" ? [_("x1"), _("y1")] : [_("x"), _("y")]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 2) {
                if (typeof args[0] === "string" || typeof args[1] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push([args[0], args[1]]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doSetXY(args[0], args[1]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doSetXY(args[0], args[1]);
                    }
                }
            }
        }
    }

    class RightBlock extends FlowBlock {
        constructor() {
            super("right");
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.piemenuValuesC1 = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Right block turns the mouse to the right."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            } else {
                this.setHelpString([
                    _("The Right block turns the turtle to the right."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            }

            this.formBlock({
                //.TRANS: right1 and right are when turning right (clockwise)
                name: this.lang === "ja" ? _("right1") : _("right"),
                args: 1,
                defaults: [90]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 1) {
                if (typeof args[0] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push(args[0]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doRight(args[0]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doRight(args[0]);
                    }
                }
            }
        }
    }

    class MLeftBlock extends FlowBlock {
        constructor() {
            super("left");
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.piemenuValuesC1 = [330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30, 0];
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Left block turns the mouse to the left."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            } else {
                this.setHelpString([
                    _("The Left block turns the turtle to the left."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            }

            this.formBlock({
                //.TRANS: left and left1 are when turning left (counter-clockwise)
                name: this.lang === "ja" ? _("left1") : _("left"),
                args: 1,
                defaults: [90]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 1) {
                if (typeof args[0] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push(args[0]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doRight(-args[0]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doRight(-args[0]);
                    }
                }
            }
        }
    }

    class BackBlock extends FlowBlock {
        constructor() {
            //.TRANS: move backward (in the opposite direction of the current heading)
            super("back", _("back"));
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Back block moves the mouse backward."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            } else {
                this.setHelpString([
                    _("The Back block moves the turtle backward."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            }

            this.formBlock({
                args: 1,
                defaults: [100]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 1) {
                if (typeof args[0] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push(args[0]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doForward(-args[0]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doForward(-args[0]);
                    }
                }
            }
        }
    }

    class ForwardBlock extends FlowBlock {
        constructor() {
            //.TRANS: move forward (in the direction of the current heading)
            super("forward", _("forward"));
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);

            if (_THIS_IS_MUSIC_BLOCKS_) {
                this.setHelpString([
                    _("The Forward block moves the mouse forward."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            } else {
                this.setHelpString([
                    _("The Forward block moves the turtle forward."),
                    "documentation",
                    null,
                    "forwardhelp"
                ]);
            }

            this.formBlock({
                args: 1,
                defaults: [100]
            });
        }

        flow(args, logo, turtle, blk) {
            const tur = activity.turtles.ithTurtle(activity.turtles.companionTurtle(turtle));

            if (args.length === 1) {
                if (typeof args[0] === "string") {
                    activity.errorMsg(NANERRORMSG, blk);
                } else if (logo.inMatrix) {
                    logo.phraseMaker.addRowBlock(blk);
                    if (logo.pitchBlocks.indexOf(blk) === -1) {
                        logo.pitchBlocks.push(blk);
                    }
                    logo.phraseMaker.rowLabels.push(activity.blocks.blockList[blk].name);
                    logo.phraseMaker.rowArgs.push(args[0]);
                } else if (tur.singer.inNoteBlock.length > 0) {
                    tur.singer.embeddedGraphics[last(tur.singer.inNoteBlock)].push(blk);
                } else {
                    if (tur.singer.suppressOutput) {
                        const savedPenState = tur.painter.penState;
                        tur.painter.penState = false;
                        tur.painter.doForward(args[0]);
                        tur.painter.penState = savedPenState;
                    } else {
                        tur.painter.doForward(args[0]);
                    }
                }
            }
        }
    }

    class WrapModeBlock extends ValueBlock {
        constructor() {
            super("wrapmode");
            this.setPalette("graphics", activity);
            this.formBlock({ outType: "textout" });
            this.hidden = true;
        }
    }

    class WrapBlock extends FlowClampBlock {
        constructor() {
            super("wrap", _("wrap"));
            this.setPalette("graphics", activity);
            this.beginnerBlock(true);
            this.setHelpString([
                _("The Wrap block enables or disables screen wrapping for the graphics actions within it."),
                "documentation",
                null,
                "wraphelp"
            ]);
            this.formBlock({
                name: _("wrap"),
                args: 1,
                defaults: ["on"],
                argTypes: ["textin"]
            });
            this.makeMacro((x, y) => [
                [0, "wrap", x, y, [null, 1, null, 2]],
                [1, ["wrapmode", { value: "on" }], 0, 0, [0]],
                [2, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk) {
            if (args[1] === undefined) return;
            if (args[0] === null) activity.errorMsg(NOINPUTERRORMSG, blk);

            const arg0 = args[0] === null ? "on" : args[0];
            const tur = activity.turtles.ithTurtle(turtle);
            const listenerName = "_wrap_" + turtle;
            tur.painter.wrap = arg0 === "on";

            if (blk !== undefined && blk in activity.blocks.blockList) {
                logo.setDispatchBlock(blk, turtle, listenerName);
            } else if (MusicBlocks.isRun) {
                const mouse = Mouse.getMouseFromTurtle(tur);
                if (mouse !== null) mouse.MB.listeners.push(listenerName);
            }

            const __listener = () => {
                tur.painter.wrap = null;
            };
            logo.setTurtleListener(turtle, listenerName, __listener);
            return [args[1], 1];
        }
    }

 
    new HeadingBlock().setup(activity);
    new YBlock().setup(activity);
    new XBlock().setup(activity);
    new WrapModeBlock().setup(activity);
    new WrapBlock().setup(activity);
    new ScrollXYBlock().setup(activity);
    new ClearBlock().setup(activity);
    new BezierBlock().setup(activity);
    new ControlPoint2Block().setup(activity);
    new ControlPoint1Block().setup(activity);
    new ArcBlock().setup(activity);
    new SetHeadingBlock().setup(activity);
    new SetXYBlock().setup(activity);
    new RightBlock().setup(activity);
    new MLeftBlock().setup(activity);
    new BackBlock().setup(activity);
    new ForwardBlock().setup(activity);
}
# Contributing


## What?

Individuals making significant and valuable contributions are given commit-access to a project to contribute as they see fit. A project is more like an open wiki than a standard guarded open source project.

## Rules

There are a few basic ground-rules for contributors (including the maintainer(s) of the project):

1. **No --force pushes** or modifying the master branch history in any way. If you need to rebase, ensure you do it in your own repo.
2. **Non-master branches**, prefixed with a short name moniker (e.g. `Dave-my-feature`) must be used for ongoing work.
3. **All modifications** must be made in a **pull-request** to solicit feedback from other contributors.
4. Contributors should adhere to the [Coding Style Guide](https://github.com/polkawallet-io/polkawallet-RN/blob/master/Style_Guide.md).

## Merge Process

1. A PR needs to be reviewed and approved by project maintainers unless:
   - it does not alter any logic (e.g. comments, dependencies, docs), then it may be tagged [`insubstantial`](https://github.com/polkawallet-io/polkawallet-RN/labels/insubstantial) and merged by its author.
   - it is an urgent fix with no large change to logic, then it may be merged after a non-author contributor has approved the review.
2. Once a PR is ready for review please add the [`pleasereview`](https://github.com/polkawallet-io/polkawallet-RN/labels/pleasereview) label. Generally PRs should sit with this label for 48 hours in order to garner feedback. It may be merged before if all relevant parties had a look at it.
3. No PR should be merged until all reviews' comments are addressed.

**Reviewing pull requests**:

When reviewing a pull request, the end-goal is to suggest useful changes to the author. Reviews should finish with approval unless there are issues that would result in:

1. Buggy behavior.
2. Undue maintenance burden.
3. Breaking with house coding style.
4. Pessimization (i.e. reduction of speed as measured in the projects benchmarks).
5. Feature reduction (i.e. it removes some aspect of functionality that a significant minority of users rely on).
6. Uselessness (i.e. it does not strictly add a feature or fix a known issue).

**Reviews may not be used as an effective veto for a PR because**:

1. There exists a somewhat cleaner/better/faster way of accomplishing the same feature/fix.
2. It does not fit well with some other contributors' longer-term vision for the project.

## Helping out

We use [labels](https://github.com/polkawallet-io/polkawallet-RN/labels) to manage PRs and issues and communicate state of a PR. Please familiarize yourself with them. Furthermore we are organizing issues in [milestones](https://github.com/polkawallet-io/polkawallet-RN/milestones). 

## Releases

Declaring formal releases remains the prerogative of the project maintainer(s).

## Changes to this arrangement

This is an experiment and feedback is welcome! This document may also be subject to pull-requests or changes by contributors where you believe you have something valuable to add or change.

## Heritage

These contributing guidelines are modified from the "OPEN Open Source Project" guidelines for the Level project: <https://github.com/Level/community/blob/master/CONTRIBUTING.md>
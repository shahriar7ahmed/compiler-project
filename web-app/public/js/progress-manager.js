/**
 * Compilation Progress Manager - Phase 5.2.3
 * Handles visual progress indication during compilation
 */

class CompilationProgressManager {
    constructor() {
        this.progressContainer = document.getElementById('compilation-progress');
        this.progressBar = document.getElementById('progress-bar');
        this.stages = ['lexical', 'syntax', 'semantic', 'optimization', 'codegen', 'execution'];
        this.currentStageIndex = 0;
    }

    /**
     * Show the progress indicator
     */
    show() {
        if (this.progressContainer) {
            this.progressContainer.style.display = 'block';
            this.reset();
        }
    }

    /**
     * Hide the progress indicator
     */
    hide() {
        if (this.progressContainer) {
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Reset progress to start
     */
    reset() {
        this.currentStageIndex = 0;
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
            this.progressBar.classList.remove('complete');
        }

        // Reset all stage indicators
        const stageElements = document.querySelectorAll('.progress-stage');
        stageElements.forEach(el => {
            el.classList.remove('active', 'complete');
        });
    }

    /**
     * Update progress to a specific stage
     * @param {number} stageIndex - Index of the stage (0-5)
     */
    updateProgress(stageIndex) {
        this.currentStageIndex = stageIndex;
        const percentage = ((stageIndex + 1) / this.stages.length) * 100;

        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }

        // Update stage indicators
        const stageElements = document.querySelectorAll('.progress-stage');
        stageElements.forEach((el, index) => {
            if (index < stageIndex) {
                el.classList.remove('active');
                el.classList.add('complete');
            } else if (index === stageIndex) {
                el.classList.remove('complete');
                el.classList.add('active');
            } else {
                el.classList.remove('active', 'complete');
            }
        });
    }

    /**
     * Advance to the next stage
     */
    nextStage() {
        if (this.currentStageIndex < this.stages.length - 1) {
            this.updateProgress(this.currentStageIndex + 1);
        }
    }

    /**
     * Mark compilation as complete
     */
    complete() {
        this.updateProgress(this.stages.length - 1);

        if (this.progressBar) {
            this.progressBar.classList.add('complete');
        }

        // Mark all stages as complete
        const stageElements = document.querySelectorAll('.progress-stage');
        stageElements.forEach(el => {
            el.classList.remove('active');
            el.classList.add('complete');
        });
    }

    /**
     * Simulate progressive compilation (for demonstration)
     * @param {number} duration - Total duration in milliseconds
     */
    async simulateProgress(duration = 2000) {
        this.show();
        const stageDelay = duration / this.stages.length;

        for (let i = 0; i < this.stages.length; i++) {
            this.updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, stageDelay));
        }

        this.complete();

        // Hide after a delay
        setTimeout(() => this.hide(), 1000);
    }
}

// Create global instance
const compilationProgress = new CompilationProgressManager();

console.log('Compilation Progress Manager loaded ✓');

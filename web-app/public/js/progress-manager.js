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
            this.progressBar.classList.remove('complete', 'error');
        }

        // Reset all stage indicators
        const stageElements = document.querySelectorAll('.progress-stage');
        stageElements.forEach(el => {
            el.classList.remove('active', 'complete', 'error');
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

    /**
     * Stop progress at a specific stage with error state
     * @param {number} failedStageIndex - Index of the stage that failed (0-5)
     */
    failAtStage(failedStageIndex) {
        this.show();

        // Mark stages up to (but not including) the failed stage as complete
        if (failedStageIndex > 0) {
            // Simulate progress up to the failed stage
            const stageDelay = 200; // Quick progression
            let currentStage = 0;

            const progressInterval = setInterval(() => {
                if (currentStage < failedStageIndex) {
                    this.updateProgress(currentStage);
                    currentStage++;
                } else {
                    clearInterval(progressInterval);

                    // Mark the failed stage with error class
                    const stageElements = document.querySelectorAll('.progress-stage');
                    if (stageElements[failedStageIndex]) {
                        stageElements[failedStageIndex].classList.add('error');
                        stageElements[failedStageIndex].classList.remove('active', 'complete');
                    }

                    // Update progress bar to failed stage percentage
                    const percentage = (failedStageIndex / this.stages.length) * 100;
                    if (this.progressBar) {
                        this.progressBar.style.width = `${percentage}%`;
                        this.progressBar.classList.add('error');
                    }

                    // Hide after a delay
                    setTimeout(() => this.hide(), 2000);
                }
            }, stageDelay);
        } else {
            // Failed at first stage
            const stageElements = document.querySelectorAll('.progress-stage');
            if (stageElements[0]) {
                stageElements[0].classList.add('error');
            }

            if (this.progressBar) {
                this.progressBar.style.width = '0%';
                this.progressBar.classList.add('error');
            }

            setTimeout(() => this.hide(), 2000);
        }
    }

    /**
     * Determine which stage failed based on compilation data
     * @param {Object} compilationData - The compilation result
     * @returns {number} Index of failed stage (0-5)
     */
    determineFailedStage(compilationData) {
        if (!compilationData || compilationData.success) {
            return -1; // No failure
        }

        // Map error stage names to indices
        const stageMap = {
            'lexical': 0,
            'syntax': 1,
            'semantic': 2,
            'optimization': 3,
            'codegen': 4,
            'execution': 5
        };

        // Check if error stage is specified
        if (compilationData.errorStage) {
            return stageMap[compilationData.errorStage.toLowerCase()] || 0;
        }

        // Fallback: analyze error message
        const errorMsg = (compilationData.error?.toLowerCase() || '');
        if (errorMsg.includes('lexical') || errorMsg.includes('token')) return 0;
        if (errorMsg.includes('syntax') || errorMsg.includes('parse')) return 1;
        if (errorMsg.includes('semantic') || errorMsg.includes('type')) return 2;
        if (errorMsg.includes('optimization')) return 3;
        if (errorMsg.includes('codegen') || errorMsg.includes('generation')) return 4;
        if (errorMsg.includes('execution') || errorMsg.includes('runtime')) return 5;

        // Default to lexical stage if we can't determine
        return 0;
    }
}

// Create global instance
const compilationProgress = new CompilationProgressManager();

console.log('Compilation Progress Manager loaded ✓');

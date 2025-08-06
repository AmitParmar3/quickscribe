<form className="w-full space-y-12">
                    <div className="space-y-10 mb-12">
                      {/* Subtitle Upload (copied from editor UI) */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Subtitle File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${dragActive.subtitle ? 'border-indigo-400 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 scale-[1.02] shadow-lg dark:from-indigo-500/20 dark:to-purple-500/20' : watch('subtitle') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/20 dark:to-teal-500/20' : 'border-border hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 hover:shadow-md dark:hover:from-indigo-500/15 dark:hover:to-purple-500/15'}`}
                          onDragEnter={(e) => handleDrag(e, 'subtitle')}
                          onDragLeave={(e) => handleDrag(e, 'subtitle')}
                          onDragOver={(e) => handleDrag(e, 'subtitle')}
                          onDrop={(e) => handleDrop(e, 'subtitle')}
                          onClick={() => handleUploadClick('subtitle')}
                        >
                          <input
                            ref={subtitleInputRef}
                            type="file"
                            accept=".srt,.txt"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelection(file, 'subtitle');
                            }}
                            className="hidden"
                          />
                          {watch('subtitle') ? (
                            <div className="space-y-2">
                              <p className="font-semibold text-foreground truncate max-w-xs mx-auto">{watch('subtitle')?.name}</p>
                              <p className="text-sm text-muted-foreground font-medium">{formatFileSize(watch('subtitle')?.size || 0)}</p>
                              <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  removeFile('subtitle');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                              >
                                <X className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">Drop your subtitle file here, or click to browse</p>
                              <p className="text-sm text-muted-foreground">Supports SRT and TXT file formats</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Language and Style Selectors */}
                    <div className="grid sm:grid-cols-2 gap-12 mb-12">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <LucideLanguages className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Select Language</h2>
                        </div>
                        <Controller
                          control={control}
                          name="language"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="language" className={cn("w-full !h-12 mt-4", !field.value ? " ":"border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-300 font-semibold")} >
                                <SelectValue placeholder="Select Language" />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang} value={lang}>
                                    {lang}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <Drama className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Select Style</h2>
                        </div>
                        <Controller
                          control={control}
                          name="style"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="styles" className={cn("w-full !h-12 mt-4", !field.value ? " ":"border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-300 font-semibold")}> <SelectValue placeholder="Choose a style"/> </SelectTrigger>
                              <SelectContent>
                                {styles.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    {/* Action Section */}
                    <div className="text-center space-y-8">
                      <button
                        onClick={handleProcess}
                        disabled={!watch('subtitle')}
                        className={cn(
                          "group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300",
                          watch('subtitle')
                            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40"
                            : "bg-gradient-to-r from-muted to-muted/50 text-muted-foreground cursor-not-allowed dark:from-muted/30 dark:to-muted/20"
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Process File
                          <div
                            className={`w-2 h-2 rounded-full ${
                              watch('subtitle')
                                ? 'bg-white animate-pulse'
                                : 'bg-muted-foreground'
                            }`}
                          ></div>
                        </span>
                        {watch('subtitle') && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </button>
                      {!watch('subtitle') && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                          <p className="text-sm font-medium">
                            Please upload a subtitle file to continue
                          </p>
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                        </div>
                      )}
                    </div>
                    {isProcessing && (
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Loader2 className="animate-spin w-4 h-4" /> Processing Translation...
                        </div>
                        <div className="w-full h-2 bg-muted rounded">
                          <div
                            className="h-full bg-green-500 rounded transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">{progress}% complete</div>
                      </div>
                    )}
                    {!isProcessing && progress === 100 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px] dark:bg-black/80">
                        <div className="bg-card/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center dark:bg-card/90 dark:border dark:border-border/50">
                          <div className="flex items-center gap-2 text-green-400 text-md pt-4">
                            <CheckCircle className="w-8 h-8" /> Translation complete!{' '}
                          </div>
                          <button
                            className="group relative px-15 py-5 mt-4 rounded-2xl font-semibold text-lg transition-all duration-100 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
                            onClick={() => router.push('/editor')}
                          >
                            Move to Editor
                          </button>
                        </div>
                      </div>
                    )}
                  </form>